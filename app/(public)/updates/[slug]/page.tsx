import { cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cleanHtml } from "@/lib/validation";
import InnerPage from "@/components/InnerPage";
const getPost = cache(async (slug: string) =>
  prisma.blog.findFirst({
    where: { slug, status: "PUBLISHED", publishedAt: { lte: new Date() } },
  }),
);
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: "/updates/" + post.slug },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  return (
    <InnerPage title={post.title}>
      <article className="content-narrow">
        <time>
          {post.publishedAt?.toLocaleDateString("en-AU", {
            timeZone: "UTC",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        {post.featuredImage && (
          <img
            className="article-image"
            src={post.featuredImage}
            alt={post.title}
          />
        )}
        <p className="lead">{post.excerpt}</p>
        <div
          className="rich-content"
          dangerouslySetInnerHTML={{ __html: cleanHtml(post.content) }}
        />
        <Link className="button secondary mt-4" href="/updates">
          All updates
        </Link>
      </article>
    </InnerPage>
  );
}
