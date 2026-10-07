import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/security";
import AdminHeading from "@/components/AdminHeading";
import EnquiryEditor from "@/components/EnquiryEditor";
import ActionButton from "@/components/ActionButton";
import styles from "./page.module.css";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const enquiry = await prisma.enquiry.findUnique({ where: { id } });
  if (!enquiry) notFound();
  return (
    <>
      <AdminHeading
        title="Enquiry details"
        description={`Reference: ${enquiry.id}`}
      />
      <Link href="/admin/enquiries">← All enquiries</Link>
      <div className={styles.grid}>
        <section className={`panel ${styles.details}`}>
          <h2>{enquiry.subject}</h2>
          <dl>
            <dt>From</dt>
            <dd>{enquiry.name}</dd>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>
            </dd>
            <dt>Phone</dt>
            <dd>{enquiry.phone || "Not provided"}</dd>
            <dt>Received (UTC)</dt>
            <dd>{enquiry.createdAt.toISOString()}</dd>
            <dt>Privacy consent (UTC)</dt>
            <dd>{enquiry.consentAt.toISOString()}</dd>
            <dt>Admin notification</dt>
            <dd>{enquiry.notificationStatus.replaceAll("_", " ")}</dd>
          </dl>
          <h3>Message</h3>
          <div className={styles.message}>{enquiry.message}</div>
          <a
            className="button"
            href={`mailto:${enquiry.email}?subject=${encodeURIComponent("Re: " + enquiry.subject)}`}
          >
            Reply in email app ↗
          </a>
          <p className="muted">
            Replies are sent from your email app. Record progress in the
            internal notes and update the status when complete.
          </p>
          {enquiry.notificationStatus !== "SENT" && (
            <ActionButton
              resource="enquiries"
              payload={{ id, action: "notify" }}
              question="Send the admin notification to the configured contact email?"
            >
              Retry admin notification
            </ActionButton>
          )}
        </section>
        <EnquiryEditor
          key={enquiry.updatedAt.toISOString()}
          id={id}
          status={enquiry.status}
          adminNotes={enquiry.adminNotes}
          updatedAt={enquiry.updatedAt.toISOString()}
        />
      </div>
    </>
  );
}
