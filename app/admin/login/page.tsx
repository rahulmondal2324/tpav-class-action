"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { showError, success } from "@/lib/alerts";
export default function Login() {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <main className="login-page">
      <div className="login-story">
        <img
          src="/assets/images/logo.png"
          width={180}
          alt="TPAV Class Action"
        />
        <div>
          <span className="eyebrow">STORIES. UPDATES. CONNECTION.</span>
          <h1>
            A place to keep
            <br />
            your community
            <br />
            in the know.
          </h1>
          <p>
            Manage stories, connect with subscribers,
            <br />
            and share the updates that matter.
          </p>
        </div>
        <small>Class Action Against TPAV · Administration</small>
      </div>
      <section className="login-panel">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            setBusy(true);
            try {
              const result = await authClient.signIn.email({
                email: String(data.get("email")),
                password: String(data.get("password")),
              });
              if (result.error)
                throw new Error(
                  "Sign-in failed. Check your credentials and try again.",
                );
              const session = await authClient.getSession();
              const user = session.data?.user as { role?: string } | undefined;
              if (!user?.role?.split(",").includes("admin")) {
                await authClient.signOut();
                throw new Error(
                  "This account does not have administrator access.",
                );
              }
              await success("Welcome back.");
              router.replace("/admin/dashboard");
              router.refresh();
            } catch (e) {
              await showError(
                e instanceof Error
                  ? e.message
                  : "Unable to sign in. Please try again.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Admin sign in</h2>
          <p className="muted">Sign in to your website workspace.</p>
          <label>
            Email address
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              maxLength={254}
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={128}
            />
          </label>
          <button className="button" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
          <p className="login-note">
            Access is limited to authorised administrators.
          </p>
          <Link href="/">← Back to website</Link>
        </form>
      </section>
    </main>
  );
}
