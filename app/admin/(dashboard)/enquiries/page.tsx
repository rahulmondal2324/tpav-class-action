import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/security";
import { pageNumber } from "@/lib/validation";
import { enquiryStatuses } from "@/lib/contact-validation";
import AdminHeading from "@/components/AdminHeading";
import Pagination from "@/components/Pagination";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams,
    page = pageNumber(sp.page),
    q = (sp.q || "").trim().slice(0, 100);
  const status = enquiryStatuses.find((s) => s === sp.status);
  const where = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: ["name", "email", "subject", "id"].map((field) => ({
            [field]: { contains: q, mode: "insensitive" as const },
          })),
        }
      : {}),
  };
  const [rows, total] = await Promise.all([
    prisma.enquiry.findMany({
      where,
      take: 20,
      skip: (page - 1) * 20,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        status: true,
        createdAt: true,
        notificationStatus: true,
      },
    }),
    prisma.enquiry.count({ where }),
  ]);
  return (
    <>
      <AdminHeading
        title="Enquiries"
        description="Review messages, track progress and keep internal notes."
      />
      <form className="filters">
        <input
          name="q"
          placeholder="Search name, email, subject or reference…"
          aria-label="Search enquiries"
          defaultValue={q}
        />
        <select
          name="status"
          aria-label="Enquiry status"
          defaultValue={status || ""}
        >
          <option value="">All statuses</option>
          {enquiryStatuses.map((s) => (
            <option key={s} value={s}>
              {s.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <button className="button secondary">Search</button>
      </form>
      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>Subject</th>
              <th>Received</th>
              <th>Status</th>
              <th>Admin notification</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <strong>{row.name}</strong>
                  <small>{row.email}</small>
                </td>
                <td>{row.subject}</td>
                <td>
                  {row.createdAt.toISOString().slice(0, 16).replace("T", " ")}{" "}
                  UTC
                </td>
                <td>
                  <span
                    className={`badge ${row.status === "RESOLVED" ? "published" : "draft"}`}
                  >
                    {row.status.replaceAll("_", " ")}
                  </span>
                </td>
                <td>{row.notificationStatus.replaceAll("_", " ")}</td>
                <td>
                  <Link
                    className="button secondary"
                    href={`/admin/enquiries/${row.id}`}
                  >
                    View enquiry
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!total && (
          <div className="empty-state compact">
            No enquiries match your search.
          </div>
        )}
      </div>
      <Pagination
        page={page}
        total={total}
        path="/admin/enquiries"
        query={`&q=${encodeURIComponent(q)}&status=${status || ""}`}
      />
    </>
  );
}
