export default function Loading() {
  return (
    <div role="status" aria-label="Loading workspace">
      <div className="skeleton title-skeleton" />
      <div className="stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <div className="skeleton" key={i} />
        ))}
      </div>
      <div className="skeleton table-skeleton" />
      <span className="sr-only">Loading workspace…</span>
    </div>
  );
}
