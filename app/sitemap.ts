import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const posts = await prisma.blog.findMany({
    where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
    select: { slug: true, updatedAt: true },
    take: 40000,
  });
  return [
    ...["", "/updates", "/authors-story", "/contact", "/privacy", "/terms"].map(
      (p) => ({ url: base + p }),
    ),
    ...posts.map((p) => ({
      url: base + "/updates/" + p.slug,
      lastModified: p.updatedAt,
    })),
  ];
}
