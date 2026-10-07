"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { api } from "@/lib/api";
import { contactSchema } from "@/lib/contact-validation";
import { useNotifications } from "./PublicNotifications";
import styles from "./ContactForm.module.css";
export default function ContactForm() {
  const { success, showError } = useNotifications();
  const locked = useRef(false);
  const submissionId = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [receipt, setReceipt] = useState("");
  return (
    <form
      className={styles.form}
      aria-busy={busy}
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        if (locked.current) return;
        const form = e.currentTarget;
        const data = new FormData(form);
        submissionId.current ??= crypto.randomUUID();
        const parsed = contactSchema.safeParse({
          ...Object.fromEntries(data),
          consent: data.get("consent") === "on",
          submissionId: submissionId.current,
        });
        setReceipt("");
        if (!parsed.success) {
          const next: Record<string, string> = {};
          for (const issue of parsed.error.issues)
            next[String(issue.path[0])] ??= issue.message;
          setErrors(next);
          (
            form.elements.namedItem(Object.keys(next)[0]) as HTMLElement | null
          )?.focus();
          return;
        }
        locked.current = true;
        setBusy(true);
        setErrors({});
        try {
          const result = await api("/api/contact", parsed.data);
          setReceipt(result.message);
          success(result.message);
          form.reset();
          submissionId.current = null;
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Unable to submit. Please try again.";
          setErrors({ form: message });
          showError(message);
        } finally {
          locked.current = false;
          setBusy(false);
        }
      }}
    >
      <h2>Send an enquiry</h2>
      <p className={styles.intro}>
        Tell us how we can help. Fields marked * are required.
      </p>
      <fieldset disabled={busy} className={styles.fields}>
        <legend className="sr-only">Your enquiry</legend>
        {(
          [
            ["name", "Full name", "text", "name", 100],
            ["email", "Email address", "email", "email", 254],
            ["phone", "Phone number (optional)", "tel", "tel", 30],
            ["subject", "Subject", "text", "off", 150],
          ] as const
        ).map(([name, label, type, autoComplete, maxLength]) => (
          <div key={name} className={styles.field}>
            <label htmlFor={`contact-${name}`}>
              {label}
              {name !== "phone" && " *"}
            </label>
            <input
              id={`contact-${name}`}
              name={name}
              type={type}
              autoComplete={autoComplete}
              maxLength={maxLength}
              required={name !== "phone"}
              aria-invalid={!!errors[name]}
              aria-describedby={
                errors[name] ? `contact-${name}-error` : undefined
              }
            />
            {errors[name] && (
              <small id={`contact-${name}-error`} className={styles.error}>
                {errors[name]}
              </small>
            )}
          </div>
        ))}
        <div className={styles.full}>
          <label htmlFor="contact-message">Message *</label>
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            required
            minLength={10}
            maxLength={5000}
            aria-invalid={!!errors.message}
            aria-describedby="contact-message-help contact-message-error"
          />
          <small id="contact-message-help">
            Please avoid sending sensitive documents or confidential personal
            details. Maximum 5,000 characters.
          </small>
          <small id="contact-message-error" className={styles.error}>
            {errors.message}
          </small>
        </div>
        <div className={styles.full}>
          <label className={styles.consent}>
            <input
              type="checkbox"
              name="consent"
              required
              aria-invalid={!!errors.consent}
              aria-describedby="contact-consent-error"
            />
            <span>
              I have read the <Link href="/privacy">privacy policy</Link> and
              agree to my details being used to respond to this enquiry. *
            </span>
          </label>
          <small id="contact-consent-error" className={styles.error}>
            {errors.consent}
          </small>
        </div>
        <div className="honeypot" aria-hidden="true">
          <label>
            Leave empty
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <button className={styles.submit} type="submit">
          {busy ? "Sending your enquiry…" : "Send enquiry →"}
        </button>
      </fieldset>
      {errors.form && (
        <p className={styles.error} role="alert">
          {errors.form}
        </p>
      )}
      {receipt && (
        <p className={styles.receipt} role="status">
          {receipt}
        </p>
      )}
      <p className={styles.footnote}>
        This form does not subscribe you to email updates.
      </p>
    </form>
  );
}
