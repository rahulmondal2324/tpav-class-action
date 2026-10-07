"use client";

import Link from "next/link";
import { useState } from "react";

import { api } from "@/lib/api";
import { useNotifications } from "./PublicNotifications";

import SubscribeForm from "./SubscribeForm";

type Action = "verify" | "unsubscribe";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-11Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="m5 7 7 5 7-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m5 12.5 4.2 4.2L19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UnsubscribeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-11Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="m5 7 7 5 7-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M8 16h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SubscriptionFlow({
  action,
  token,
}: {
  action: Action;
  token: string;
}) {
  const { confirm, success, showError } = useNotifications();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState("");

  const isVerify = action === "verify";

  /* =====================================================
     NO TOKEN
  ===================================================== */

  if (!token) {
    return (
      <div className="subscription-flow-card">
        <div className="subscription-flow-icon">
          {isVerify ? <MailIcon /> : <UnsubscribeIcon />}
        </div>

        <span className="subscription-flow-label">
          {isVerify ? "EMAIL VERIFICATION" : "EMAIL PREFERENCES"}
        </span>

        <h2 className="subscription-flow-title">
          {isVerify
            ? "Need a new confirmation link?"
            : "Unsubscribe from an email"}
        </h2>

        <p className="subscription-flow-description">
          {isVerify
            ? "Enter your email address below and we’ll help you request a fresh confirmation email."
            : "For your security, please use the unsubscribe link at the bottom of one of your TPAV Class Action emails."}
        </p>

        {isVerify ? (
          <>
            <div className="subscription-flow-form">
              <SubscribeForm />
            </div>

            <div className="subscription-flow-info">
              <span className="subscription-flow-info-icon">✓</span>

              <div>
                <strong>No account required</strong>

                <p>
                  You do not need a password or account to receive TPAV Class
                  Action updates.
                </p>
              </div>
            </div>
          </>
        ) : (
          <Link href="/updates" className="subscription-flow-primary">
            View latest updates
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    );
  }

  /* =====================================================
     SUCCESS STATE
  ===================================================== */

  if (done) {
    return (
      <div className="subscription-flow-card subscription-flow-success">
        <div className="subscription-flow-icon subscription-flow-icon-success">
          <CheckIcon />
        </div>

        <span className="subscription-flow-label">
          {isVerify ? "EMAIL VERIFIED" : "PREFERENCES UPDATED"}
        </span>

        <h2 className="subscription-flow-title">
          {isVerify ? "You're connected." : "You've been unsubscribed."}
        </h2>

        <p className="subscription-flow-description">
          {message ||
            (isVerify
              ? "Your email has been confirmed successfully. You'll now receive TPAV Class Action news and updates."
              : "You will no longer receive TPAV Class Action update emails.")}
        </p>

        <Link href="/updates" className="subscription-flow-primary">
          Read the latest updates
          <span aria-hidden="true">→</span>
        </Link>

        <Link href="/" className="subscription-flow-text-link">
          Return to home
        </Link>

        {isVerify && (
          <p className="subscription-flow-footer-note">
            You can unsubscribe at any time from any update email.
          </p>
        )}
      </div>
    );
  }

  /* =====================================================
     CONFIRMATION STATE
  ===================================================== */

  return (
    <div className="subscription-flow-card">
      <div
        className={`subscription-flow-icon ${
          !isVerify ? "subscription-flow-icon-unsubscribe" : ""
        }`}
      >
        {isVerify ? <MailIcon /> : <UnsubscribeIcon />}
      </div>

      <span className="subscription-flow-label">
        {isVerify ? "EMAIL VERIFICATION" : "EMAIL PREFERENCES"}
      </span>

      <h2 className="subscription-flow-title">
        {isVerify ? "Almost there." : "Confirm unsubscribe"}
      </h2>

      <p className="subscription-flow-description">
        {isVerify
          ? "Confirm your email address to receive TPAV Class Action stories, announcements and important updates."
          : "Please confirm that you would like to stop receiving TPAV Class Action update emails."}
      </p>

      <button
        type="button"
        className={`subscription-flow-primary ${
          !isVerify ? "subscription-flow-danger" : ""
        }`}
        disabled={busy}
        onClick={async () => {
          if (busy) return;

          const confirmed = await confirm(
            isVerify ? "Confirm subscription?" : "Unsubscribe?",
            isVerify
              ? "You agree to receive TPAV Class Action updates."
              : "You will stop receiving email updates.",
          );

          if (!confirmed) {
            return;
          }

          setBusy(true);
          setMessage("");

          try {
            const result = await api("/api/subscription", {
              action,
              token,
            });

            setMessage(result.message);
            setDone(true);

            await success(result.message);
          } catch (error) {
            const text =
              error instanceof Error ? error.message : "Please try again.";

            setMessage(text);

            await showError(text);
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? (
          <>
            <span className="subscription-button-spinner" />

            {isVerify ? "Confirming..." : "Updating..."}
          </>
        ) : (
          <>
            {isVerify ? "Confirm subscription" : "Confirm unsubscribe"}

            <span aria-hidden="true">→</span>
          </>
        )}
      </button>

      {message && (
        <div className="subscription-flow-error" role="alert">
          <span>!</span>

          <p>{message}</p>
        </div>
      )}

      {message && !done && isVerify && (
        <div className="subscription-flow-retry">
          <p>Need another verification link?</p>

          <SubscribeForm />
        </div>
      )}

      <div className="subscription-flow-info">
        <span className="subscription-flow-info-icon">✓</span>

        <div>
          <strong>
            {isVerify
              ? "No account or password required"
              : "Only marketing updates will stop"}
          </strong>

          <p>
            {isVerify
              ? "Confirming your email only subscribes you to TPAV Class Action updates."
              : "You can return to the website at any time."}
          </p>
        </div>
      </div>

      {isVerify && (
        <p className="subscription-flow-footer-note">
          For security, verification links expire after 24 hours.
        </p>
      )}
    </div>
  );
}
