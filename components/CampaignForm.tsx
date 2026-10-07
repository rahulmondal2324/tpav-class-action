"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RichEditor from "./RichEditor";
import { api, confirm, success, showError } from "@/lib/alerts";
export default function CampaignForm() {
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <form
      className="panel form-grid"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        if (
          !(await confirm(
            "Save campaign draft?",
            "You can review the draft before sending it to subscribers.",
          ))
        )
          return;
        setBusy(true);
        try {
          const result = await api("/api/admin/campaigns", {
            ...data,
            content,
          });
          await success(result.message);
          router.push("/admin/email-updates");
          router.refresh();
        } catch (e) {
          await showError(e instanceof Error ? e.message : "Please try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label>
        Subject
        <input name="subject" required minLength={3} maxLength={180} />
      </label>
      <label>
        Heading
        <input name="heading" maxLength={180} />
      </label>
      <div className="full">
        <label>Email content</label>
        <RichEditor value={content} onChange={setContent} />
      </div>
      <label>
        Button text
        <input name="buttonText" maxLength={60} />
      </label>
      <label>
        Button URL
        <input name="buttonUrl" type="url" placeholder="https://…" />
      </label>
      <p className="full muted">
        Only verified, subscribed recipients receive campaigns. An unsubscribe
        link is included automatically.
      </p>
      <div className="full">
        <button disabled={busy} className="button">
          {busy ? "Saving…" : "Save draft"}
        </button>
      </div>
    </form>
  );
}
