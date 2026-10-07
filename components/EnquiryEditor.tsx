"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, success, showError } from "@/lib/alerts";
import { enquiryStatuses } from "@/lib/contact-validation";
import styles from "./EnquiryEditor.module.css";
export default function EnquiryEditor({
  id,
  status,
  adminNotes,
  updatedAt,
}: {
  id: string;
  status: string;
  adminNotes: string;
  updatedAt: string;
}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <form
      className={`panel ${styles.editor}`}
      aria-busy={busy}
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        const data = new FormData(e.currentTarget);
        setBusy(true);
        try {
          const result = await api("/api/admin/enquiries", {
            id,
            action: "update",
            status: data.get("status"),
            adminNotes: data.get("adminNotes"),
            updatedAt,
          });
          await success(result.message);
          router.refresh();
        } catch (error) {
          await showError(
            error instanceof Error ? error.message : "Unable to save.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2>Manage enquiry</h2>
      <fieldset disabled={busy}>
        <legend className="sr-only">Enquiry management</legend>
        <label htmlFor="enquiry-status">Status</label>
        <select id="enquiry-status" name="status" defaultValue={status}>
          {enquiryStatuses.map((s) => (
            <option value={s} key={s}>
              {s.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <label htmlFor="enquiry-notes">Internal notes</label>
        <textarea
          id="enquiry-notes"
          name="adminNotes"
          defaultValue={adminNotes}
          rows={7}
          maxLength={10000}
        />
        <p className="muted">
          Internal notes are visible only to administrators. They are not
          emailed to the sender.
        </p>
        <button className="button" type="submit">
          {busy ? "Saving…" : "Save changes"}
        </button>
      </fieldset>
    </form>
  );
}
