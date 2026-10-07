import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/security";
import { cleanHtml, pageNumber } from "@/lib/validation";
import AdminHeading from "@/components/AdminHeading";
import ActionButton from "@/components/ActionButton";
import Pagination from "@/components/Pagination";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin();
  const id = (await params).id;
  const page = pageNumber((await searchParams).page);
  const c = await prisma.emailCampaign.findUnique({ where: { id } });
  if (!c) notFound();
  const [logs, total, eligible] = await Promise.all([
    prisma.emailLog.findMany({
      where: { campaignId: id },
      take: 20,
      skip: (page - 1) * 20,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        status: true,
        errorMessage: true,
        attempts: true,
        sentAt: true,
        providerMessageId: true,
      },
    }),
    prisma.emailLog.count({ where: { campaignId: id } }),
    prisma.subscriber.count({
      where: { emailVerified: true, subscribed: true },
    }),
  ]);
  return (
    <>
      <AdminHeading
        title={c.subject}
        description={c.status + " · " + c.type.replaceAll("_", " ")}
      >
        {c.status === "DRAFT" && (
          <>
            <ActionButton
              resource="campaigns"
              payload={{ id, action: "queue" }}
              question={
                "Queue this campaign for " +
                eligible +
                " verified, subscribed recipients? Sending cannot be undone."
              }
            >
              Queue campaign ({eligible})
            </ActionButton>
            <ActionButton
              resource="campaigns"
              payload={{ id, action: "delete" }}
              question="Permanently delete this draft?"
              danger
            >
              Delete draft
            </ActionButton>
          </>
        )}
      </AdminHeading>
      <section className="panel email-preview">
        <span className="eyebrow">MESSAGE PREVIEW</span>
        <h2>{c.heading || c.subject}</h2>
        <div
          className="rich-content"
          dangerouslySetInnerHTML={{ __html: cleanHtml(c.content) }}
        />
        {c.buttonText && c.buttonUrl && (
          <a
            className="button"
            href={c.buttonUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {c.buttonText}
          </a>
        )}
        <hr />
        <small>An unsubscribe link is added for each recipient.</small>
      </section>
      <h2 className="mt-4">Delivery history</h2>
      <p className="muted">
        Sent means accepted by the provider, not guaranteed inbox delivery.
        Failed rows include opted-out recipients and uncertain deliveries.
      </p>
      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Recipient</th>
              <th>Status</th>
              <th>Attempts</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td>{l.email}</td>
                <td>
                  <span className="badge">{l.status}</span>
                </td>
                <td>{l.attempts}</td>
                <td>
                  {l.errorMessage ||
                    l.providerMessageId ||
                    "Waiting for worker"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!total && (
          <div className="empty-state compact">
            Delivery logs appear after the campaign is queued.
          </div>
        )}
      </div>
      <Pagination
        page={page}
        total={total}
        path={"/admin/email-updates/" + id}
      />
    </>
  );
}
