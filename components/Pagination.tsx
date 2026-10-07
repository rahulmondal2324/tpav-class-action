import Link from "next/link";
export default function Pagination({
  page,
  total,
  path,
  query = "",
}: {
  page: number;
  total: number;
  path: string;
  query?: string;
}) {
  return (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 && (
        <Link
          className="button secondary"
          href={`${path}?page=${page - 1}${query}`}
        >
          Previous
        </Link>
      )}
      <span>
        Page {page} · {total} results
      </span>
      {page * 20 < total && (
        <Link
          className="button secondary"
          href={`${path}?page=${page + 1}${query}`}
        >
          Next
        </Link>
      )}
    </nav>
  );
}
