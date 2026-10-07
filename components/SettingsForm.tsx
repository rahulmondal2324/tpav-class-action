"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, confirm, success, showError } from "@/lib/alerts";
export default function SettingsForm({
  settings,
}: {
  settings: Record<string, string>;
}) {
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
            "Save website settings?",
            "These changes will appear on the public website.",
          ))
        )
          return;
        setBusy(true);
        try {
          const result = await api("/api/admin/settings", data);
          await success(result.message);
          router.refresh();
        } catch (e) {
          await showError(e instanceof Error ? e.message : "Please try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label>
        Site title
        <input
          name="siteTitle"
          defaultValue={settings.siteTitle}
          required
          maxLength={100}
        />
      </label>
      <label>
        Contact email
        <input
          name="contactEmail"
          type="email"
          defaultValue={settings.contactEmail}
        />
      </label>
      {[
        ["authorStory", "Author’s story"],
        ["privacy", "Privacy policy"],
        ["terms", "Terms of service"],
      ].map(([key, label]) => (
        <label className="full" key={key}>
          {label}
          <textarea
            name={key}
            rows={8}
            maxLength={20000}
            defaultValue={settings[key]}
          />
          <small>
            Plain text. Separate paragraphs with blank lines. Publish your
            approved wording here.
          </small>
        </label>
      ))}
      {["facebook", "instagram", "twitter", "youtube"].map((key) => (
        <label key={key}>
          {key}
          <input
            name={key}
            type="url"
            defaultValue={settings[key]}
            placeholder="https://…"
          />
        </label>
      ))}
      <div className="full">
        <button className="button" disabled={busy}>
          {busy ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
