import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/security";
import { pageNumber } from "@/lib/validation";
import AdminHeading from "@/components/AdminHeading";
import ActionButton from "@/components/ActionButton";
import Pagination from "@/components/Pagination";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const page = pageNumber(sp.page);
  const q = (sp.q || "").slice(0, 100);
  const filter = sp.status || "";
  const where = {
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(filter === "active"
      ? { emailVerified: true, subscribed: true }
      : filter === "unverified"
        ? { emailVerified: false }
        : filter === "unsubscribed"
          ? { subscribed: false, unsubscribedAt: { not: null } }
          : filter === "verified"
            ? { emailVerified: true }
            : {}),
  };
  const [rows, total] = await Promise.all([
    prisma.subscriber.findMany({
      where,
      take: 20,
      skip: (page - 1) * 20,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        emailVerified: true,
        subscribed: true,
        unsubscribedAt: true,
        createdAt: true,
      },
    }),
    prisma.subscriber.count({ where }),
  ]);
  return (
    <>
      <AdminHeading
        title="Subscribers"
        description="A community built on clear consent."
      />
      <form className="filters">
        <input
          name="q"
          aria-label="Search subscribers"
          placeholder="Search name or email…"
          defaultValue={q}
        />
        <select
          name="status"
          aria-label="Subscription status"
          defaultValue={filter}
        >
          <option value="">All subscribers</option>
          <option value="active">Active subscribers</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>
        <button className="button secondary">Search</button>
      </form>
      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Subscriber</th>
              <th>Verification</th>
              <th>Subscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id}>
                <td>
                  <strong>{s.name}</strong>
                  <small>{s.email}</small>
                  {s.phoneNumber && <small>{s.phoneNumber}</small>}
                </td>
                <td>
                  <span
                    className={
                      "badge " + (s.emailVerified ? "published" : "draft")
                    }
                  >
                    {s.emailVerified ? "Verified" : "Unverified"}
                  </span>
                </td>
                <td>
                  {s.subscribed
                    ? "Subscribed"
                    : s.unsubscribedAt
                      ? "Unsubscribed"
                      : "Awaiting confirmation"}
                </td>
                <td>
                  <div className="actions">
                    {s.subscribed ? (
                      <ActionButton
                        resource="subscribers"
                        payload={{ id: s.id, action: "unsubscribe" }}
                        question="Stop sending updates to this subscriber?"
                      >
                        Unsubscribe
                      </ActionButton>
                    ) : (
                      <ActionButton
                        resource="subscribers"
                        payload={{ id: s.id, action: "resend" }}
                        question="Send a new confirmation email? The recipient must opt in before receiving updates."
                      >
                        {s.emailVerified
                          ? "Request reactivation"
                          : "Resend verification"}
                      </ActionButton>
                    )}
                    <ActionButton
                      resource="subscribers"
                      payload={{ id: s.id, action: "delete" }}
                      question="Delete this subscriber and anonymise their delivery history? This cannot be undone."
                      danger
                    >
                      Delete
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!total && (
          <div className="empty-state compact">
            No subscribers match your search.
          </div>
        )}
      </div>
      <Pagination
        page={page}
        total={total}
        path="/admin/subscribers"
        query={
          "&q=" +
          encodeURIComponent(q) +
          "&status=" +
          encodeURIComponent(filter)
        }
      />
    </>
  );
}
