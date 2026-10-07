import { put } from "@vercel/blob";
import sharp from "sharp";
import { requireAdmin, checkOrigin, AppError } from "@/lib/security";
import { failure, limitedBody } from "@/lib/http";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    await requireAdmin();
    if (!process.env.BLOB_READ_WRITE_TOKEN)
      throw new AppError(
        "Configure Vercel Blob storage or enter an existing HTTPS image URL.",
        503,
      );
    if (Number(request.headers.get("content-length")) > 4000000)
      throw new AppError("Choose an image smaller than 3 MB.", 413);
    const bytesIn = await limitedBody(request, 4000000);
    const data = await new Response(new Uint8Array(bytesIn), {
      headers: { "Content-Type": request.headers.get("content-type") || "" },
    }).formData();
    const file = data.get("file");
    if (
      !(file instanceof File) ||
      file.size > 3000000 ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    )
      throw new AppError("Choose a JPG, PNG or WebP image smaller than 3 MB.");
    const bytes = await sharp(Buffer.from(await file.arrayBuffer()), {
      limitInputPixels: 25000000,
    })
      .rotate()
      .resize({
        width: 1800,
        height: 1800,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();
    const blob = await put(`blog/${crypto.randomUUID()}.webp`, bytes, {
      access: "public",
      contentType: "image/webp",
      addRandomSuffix: false,
    });
    return Response.json({ url: blob.url });
  } catch (e) {
    return failure(e);
  }
}
