export default function Loading() {
  return (
    <div className="loading-view" role="status" aria-live="polite">
      <div className="spinner" />
      <p>Loading…</p>
    </div>
  );
}
