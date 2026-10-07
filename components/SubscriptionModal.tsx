"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useNotifications } from "./PublicNotifications";

const SubscriptionContext = createContext<(email?: string) => void>(() => {});
export function useSubscription() {
  return useContext(SubscriptionContext);
}
export function JoinButton({
  children,
  className = "btn-action",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const open = useSubscription();
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      onClick={() => open()}
    >
      {children}
    </button>
  );
}
export default function SubscriptionModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const { success, info } = useNotifications();
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    if (!opened) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [opened]);
  function close() {
    if (!busy) dialog.current?.close();
  }
  function open(value = "") {
    if (dialog.current?.open) return;

    form.current?.reset();

    const honeypot = form.current?.elements.namedItem(
      "website",
    ) as HTMLInputElement | null;

    if (honeypot) {
      honeypot.value = "";
    }

    if (email.current) {
      email.current.value = value;
    }

    setError("");
    setOpened(true);
    dialog.current?.showModal();
  }
  return (
    <SubscriptionContext.Provider value={open}>
      {children}
      <dialog
        ref={dialog}
        className="subscription-dialog"
        aria-labelledby="join-title"
        aria-describedby="join-description"
        onClose={() => setOpened(false)}
        onCancel={(e) => {
          if (busy) e.preventDefault();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            const r = e.currentTarget.getBoundingClientRect();

            if (
              e.clientX < r.left ||
              e.clientX > r.right ||
              e.clientY < r.top ||
              e.clientY > r.bottom
            ) {
              close();
            }
          }
        }}
      >
        <button
          type="button"
          className="join-close"
          aria-label="Close signup"
          disabled={busy}
          onClick={close}
        >
          ×
        </button>

        <div className="subscription-scroll">
          <div className="join-intro">
            <span className="banner-sub-heading">
              CLASS ACTION AGAINST TPAV
            </span>

            <h2 id="join-title">Stay connected.</h2>

            <p id="join-description">
              Join our community for the latest stories and updates.
              <br />
              No account or password needed.
            </p>
          </div>

          <form
            ref={form}
            className="join-fields"
            aria-busy={busy}
            onSubmit={async (e) => {
              e.preventDefault();

              if (busy) return;

              const data = new FormData(e.currentTarget);

              setBusy(true);
              setError("");

              try {
                const result = await api("/api/subscribe", {
                  firstName: data.get("firstName"),
                  lastName: data.get("lastName"),
                  phoneNumber: data.get("phoneNumber"),
                  email: data.get("email"),
                  consent: data.get("consent") === "on",
                  website: data.get("website"),
                });

                dialog.current?.close();

                if (result.status === "already_subscribed")
                  info(result.message);
                else success(result.message);

                form.current?.reset();
              } catch (e) {
                setError(e instanceof Error ? e.message : "Please try again.");
              } finally {
                setBusy(false);
              }
            }}
          >
            <fieldset disabled={busy} className="join-grid">
              <legend className="sr-only">Your contact details</legend>

              <label>
                First name
                <input
                  name="firstName"
                  autoComplete="given-name"
                  required
                  maxLength={50}
                  placeholder="First name"
                />
              </label>

              <label>
                Last name
                <input
                  name="lastName"
                  autoComplete="family-name"
                  required
                  maxLength={50}
                  placeholder="Last name"
                />
              </label>

              <label className="join-full">
                Phone number
                <input
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  maxLength={30}
                  placeholder="e.g. +61 400 123 456"
                />
                <small>Include your country code if outside Australia.</small>
              </label>

              <label className="join-full">
                Email address
                <input
                  ref={email}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  placeholder="Your email address"
                />
              </label>

              <label className="join-full join-consent">
                <input type="checkbox" name="consent" required />

                <span>
                  I agree to receive email updates and have read the{" "}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer">
                    privacy policy
                  </a>
                  .
                </span>
              </label>

              <div className="honeypot" aria-hidden="true">
                <label htmlFor="subscription-security-field">
                  Leave this field empty
                </label>

                <input
                  id="subscription-security-field"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="new-password"
                  inputMode="none"
                  defaultValue=""
                  data-1p-ignore="true"
                  data-lpignore="true"
                  data-form-type="other"
                />
              </div>

              {error && (
                <div className="join-full join-error" role="alert">
                  {error}
                </div>
              )}

              <button type="submit" className="btn-action join-full">
                {busy ? "Sending confirmation…" : "Join Now"}
              </button>
            </fieldset>

            <p className="join-privacy">
              Secure & private · Verify by email · Unsubscribe anytime
            </p>
          </form>
        </div>
      </dialog>
    </SubscriptionContext.Provider>
  );
}
