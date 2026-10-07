import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/security";
import AdminHeading from "@/components/AdminHeading";
import BlogForm from "@/components/BlogForm";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const post = await prisma.blog.findUnique({
    where: { id: (await params).id },
  });
  if (!post) notFound();
  return (
    <>
      <AdminHeading
        title="Edit story"
        description="Review your changes before saving."
      />
      <BlogForm
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          content: post.content,
          featuredImage: post.featuredImage || "",
          metaTitle: post.metaTitle || "",
          metaDescription: post.metaDescription || "",
          keywords: post.keywords || "",
          status: post.status,
          publishedAt: post.publishedAt?.toISOString() || "",
          updatedAt: post.updatedAt.toISOString(),
        }}
      />
    </>
  );
}
