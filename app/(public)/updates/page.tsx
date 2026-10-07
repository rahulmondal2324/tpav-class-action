import Link from "next/link";
import InnerPage from "@/components/InnerPage";
import Pagination from "@/components/Pagination";
import { prisma } from "@/lib/prisma";
import { pageNumber } from "@/lib/validation";
export const metadata = { title: "News & Updates" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = pageNumber((await searchParams).page);
  const where = {
    status: "PUBLISHED" as const,
    publishedAt: { lte: new Date() },
  };
  const [posts, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: 20,
      skip: (page - 1) * 20,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
      },
    }),
    prisma.blog.count({ where }),
  ]);
  return (
    <InnerPage title="News & Updates">
      <div className="blog-grid">
        {posts.map((post) => (
          <article className="post-card" key={post.id}>
            {post.featuredImage && (
              <Link href={"/updates/" + post.slug}>
                <img src={post.featuredImage} alt={post.title} loading="lazy" />
              </Link>
            )}
            <div>
              <time>
                {post.publishedAt?.toLocaleDateString("en-AU", {
                  timeZone: "UTC",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h2>
                <Link href={"/updates/" + post.slug}>{post.title}</Link>
              </h2>
              <p>{post.excerpt}</p>
              <Link className="info-link" href={"/updates/" + post.slug}>
                Read story
              </Link>
            </div>
          </article>
        ))}
      </div>
      {!total && (
        <div className="empty-state">
          <h2>A new chapter is on its way</h2>
          <p>Subscribe to hear when the next story or update is published.</p>
          <Link className="btn-action" href="/#subscribe">
            Stay updated
          </Link>
        </div>
      )}
      <Pagination page={page} total={total} path="/updates" />
    </InnerPage>
  );
}
