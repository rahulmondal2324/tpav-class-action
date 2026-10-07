import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/security";
import { pageNumber } from "@/lib/validation";
import AdminHeading from "@/components/AdminHeading";
import ActionButton from "@/components/ActionButton";
import Pagination from "@/components/Pagination";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const page = pageNumber(sp.page);
  const q = (sp.q || "").slice(0, 100);
  const status: "DRAFT" | "PUBLISHED" | undefined =
    sp.status === "DRAFT" || sp.status === "PUBLISHED" ? sp.status : undefined;
  const where = {
    ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
    ...(status ? { status } : {}),
  };
  const [posts, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 20,
      skip: (page - 1) * 20,
    }),
    prisma.blog.count({ where }),
  ]);
  return (
    <>
      <AdminHeading
        title="Blogs & stories"
        description="Create, refine and share your latest news."
      >
        <Link className="button" href="/admin/blogs/add">
          New post
        </Link>
      </AdminHeading>
      <form className="filters">
        <input
          name="q"
          aria-label="Search posts"
          placeholder="Search stories…"
          defaultValue={q}
        />
        <select
          name="status"
          aria-label="Filter status"
          defaultValue={status || ""}
        >
          <option value="">All statuses</option>
          <option>DRAFT</option>
          <option>PUBLISHED</option>
        </select>
        <button className="button secondary">Search</button>
      </form>
      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Story</th>
              <th>Status</th>
              <th>Publish date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong>{p.title}</strong>
                  <small>/{p.slug}</small>
                </td>
                <td>
                  <span className={"badge " + p.status.toLowerCase()}>
                    {p.publishedAt && p.publishedAt > new Date()
                      ? "SCHEDULED"
                      : p.status}
                  </span>
                </td>
                <td>{p.publishedAt?.toLocaleDateString("en-AU") || "—"}</td>
                <td>
                  <div className="actions">
                    <Link
                      className="button secondary"
                      href={"/admin/blogs/" + p.id + "/edit"}
                    >
                      Edit
                    </Link>
                    <ActionButton
                      resource="blogs"
                      payload={{ id: p.id, action: "delete" }}
                      question="Permanently delete this post? This cannot be undone."
                      danger
                    >
                      Delete
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!total && (
          <div className="empty-state compact">No posts match your search.</div>
        )}
      </div>
      <Pagination
        page={page}
        total={total}
        path="/admin/blogs"
        query={"&q=" + encodeURIComponent(q) + "&status=" + (status || "")}
      />
    </>
  );
}
