"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, confirm, success, showError } from "@/lib/alerts";
export default function ActionButton({
  children,
  resource,
  payload,
  question,
  danger = false,
}: {
  children: React.ReactNode;
  resource: string;
  payload: Record<string, unknown>;
  question: string;
  danger?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <button
      className={danger ? "button danger" : "button secondary"}
      disabled={busy}
      onClick={async () => {
        if (!(await confirm("Please confirm", question))) return;
        setBusy(true);
        try {
          const result = await api(`/api/admin/${resource}`, payload);
          await success(result.message);
          router.refresh();
        } catch (e) {
          await showError(e instanceof Error ? e.message : "Please try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? "Working…" : children}
    </button>
  );
}
