import Link from "next/link";
export default function NotFound() {
  return (
    <main className="empty-state">
      <img src="/assets/images/logo.png" width={170} alt="TPAV Class Action" />
      <h1>Page not found</h1>
      <p>This page may have moved or is not published yet.</p>
      <Link className="button" href="/">
        Back to home
      </Link>
    </main>
  );
}
