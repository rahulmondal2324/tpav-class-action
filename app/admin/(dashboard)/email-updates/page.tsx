import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/security";
import { pageNumber } from "@/lib/validation";
import AdminHeading from "@/components/AdminHeading";
import ActionButton from "@/components/ActionButton";
import Pagination from "@/components/Pagination";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin();
  const page = pageNumber((await searchParams).page);
  const [rows, total] = await Promise.all([
    prisma.emailCampaign.findMany({
      take: 20,
      skip: (page - 1) * 20,
      orderBy: { createdAt: "desc" },
    }),
    prisma.emailCampaign.count(),
  ]);
  return (
    <>
      <AdminHeading
        title="Email updates"
        description="Thoughtful updates, delivered with consent."
      >
        <ActionButton
          resource="campaigns"
          payload={{ action: "process" }}
          question="Process the next batch of queued emails now?"
        >
          Process queue
        </ActionButton>
        <Link className="button" href="/admin/email-updates/new">
          New campaign
        </Link>
      </AdminHeading>
      <div className="notice">
        Review drafts before queuing. The scheduled worker sends in small
        batches and records each result.
      </div>
      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Status</th>
              <th>Recipients</th>
              <th>Sent / Failed</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td>
                  <strong>{c.subject}</strong>
                  <small>{c.type.replaceAll("_", " ")}</small>
                </td>
                <td>
                  <span className="badge">{c.status}</span>
                </td>
                <td>{c.recipientCount}</td>
                <td>
                  {c.sentCount} / {c.failedCount}
                </td>
                <td>
                  <Link
                    className="button secondary"
                    href={"/admin/email-updates/" + c.id}
                  >
                    Review & logs
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!total && (
          <div className="empty-state compact">
            No campaigns yet. Write your first update.
          </div>
        )}
      </div>
      <Pagination page={page} total={total} path="/admin/email-updates" />
    </>
  );
}
