import { enquiryUpdateSchema } from "@/lib/contact-validation";
import { notifyEnquiry } from "@/lib/enquiries";
import { prisma } from "@/lib/prisma";
import { requireAdmin, checkOrigin, AppError } from "@/lib/security";
import { jsonBody, failure } from "@/lib/http";
import { blogSchema, campaignSchema } from "@/lib/validation";
import {
  queueCampaign,
  queueCampaignInTransaction,
  processQueue,
} from "@/lib/campaigns";
import { assertEmailConfigured } from "@/lib/email";
import { requestVerification } from "@/lib/subscribers";
import { z } from "zod";
import { revalidatePath } from "next/cache";
export const maxDuration = 60;
export async function POST(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  try {
    checkOrigin(request);
    await requireAdmin();
    const { resource } = await params;
    const body = await jsonBody(request);
    if (resource === "enquiries") {
      const id = z.string().cuid().parse(body.id);
      if (body.action === "notify") {
        if (
          !(await prisma.enquiry.findUnique({
            where: { id },
            select: { id: true },
          }))
        )
          throw new AppError("Enquiry not found.", 404);
        const status = await notifyEnquiry(id);
        if (status !== "SENT")
          throw new AppError(
            status === "NOT_CONFIGURED"
              ? "Set the contact email in Settings (or CONTACT_NOTIFICATION_EMAIL) and configure email delivery before retrying."
              : "The notification could not be sent. The enquiry remains saved.",
            503,
          );
        revalidatePath("/admin/enquiries");
        revalidatePath("/admin/enquiries/" + id);
        return Response.json({ message: "Admin notification sent." });
      }
      if (body.action !== "update")
        throw new AppError("Invalid enquiry action.");
      const { status, adminNotes, updatedAt } = enquiryUpdateSchema.parse(body);
      const changed = await prisma.enquiry.updateMany({
        where: { id, updatedAt: new Date(updatedAt) },
        data: { status, adminNotes },
      });
      if (!changed.count)
        throw new AppError(
          "This enquiry changed in another window. Reload before saving.",
          409,
        );
      revalidatePath("/admin/enquiries");
      revalidatePath("/admin/enquiries/" + id);
      return Response.json({ message: "Enquiry updated." });
    }
    if (resource === "blogs") {
      const id = body.id ? z.string().cuid().parse(body.id) : undefined;
      if (body.action === "delete") {
        if (!id) throw new AppError("Missing blog.");
        await prisma.$transaction(async (tx) => {
          if (
            await tx.emailCampaign.count({
              where: { blogId: id, status: "SENDING" },
            })
          )
            throw new AppError(
              "Wait for the active notification campaign to finish before deleting.",
              409,
            );
          await tx.blog.delete({ where: { id } });
        });
      } else {
        const { notify, publishedAt, updatedAt, ...input } =
          blogSchema.parse(body);
        const date =
          input.status === "PUBLISHED"
            ? new Date(publishedAt || Date.now())
            : null;
        if (
          notify &&
          (input.status !== "PUBLISHED" || (date && date > new Date()))
        )
          throw new AppError(
            "Publish now before notifying subscribers. Scheduled posts can be notified after their publish date.",
          );
        if (notify) assertEmailConfigured();
        await prisma.$transaction(async (tx) => {
          const data = { ...input, publishedAt: date };
          if (id) {
            if (!updatedAt)
              throw new AppError("Reload this post before saving.", 409);
            const changed = await tx.blog.updateMany({
              where: { id, updatedAt: new Date(updatedAt) },
              data,
            });
            if (!changed.count)
              throw new AppError(
                "This post was changed in another window. Reload before saving.",
                409,
              );
          }
          const blog = id
            ? await tx.blog.findUniqueOrThrow({ where: { id } })
            : await tx.blog.create({ data });
          if (notify && !blog.emailNotificationSent) {
            const campaign = await tx.emailCampaign.upsert({
              where: { notificationKey: blog.id },
              update: {},
              create: {
                notificationKey: blog.id,
                blogId: blog.id,
                type: "BLOG_NOTIFICATION",
                subject: blog.title,
                heading: blog.title,
                content: `<p>${(blog.excerpt || blog.title).replace(/[<>&]/g, "")}</p>`,
                buttonText: "Read the update",
                buttonUrl: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.BETTER_AUTH_URL}/updates/${blog.slug}`,
              },
            });
            if (campaign.status === "DRAFT")
              await queueCampaignInTransaction(tx, campaign.id);
          }
        });
      }
      revalidatePath("/updates");
      revalidatePath("/admin/blogs");
      return Response.json({
        message: body.notify
          ? "Post saved. Subscriber notification is queued or was already sent. View progress in Email Updates."
          : "Blog updated successfully.",
      });
    }
    if (resource === "subscribers") {
      const id = z.string().cuid().parse(body.id);
      const s = await prisma.subscriber.findUniqueOrThrow({ where: { id } });
      if (body.action === "unsubscribe")
        await prisma.subscriber.update({
          where: { id },
          data: {
            subscribed: false,
            unsubscribedAt: new Date(),
            verificationToken: null,
            verificationExpiresAt: null,
          },
        });
      else if (body.action === "resend") {
        if (s.emailVerified && s.subscribed)
          throw new AppError("This subscriber is already active.");
        await requestVerification(s.name, s.email);
      } else if (body.action === "delete") {
        await prisma.$transaction(async (tx) => {
          await tx.emailLog.updateMany({
            where: { subscriberId: id },
            data: { email: "[deleted]", payload: null },
          });
          await tx.subscriber.delete({ where: { id } });
        });
      } else throw new AppError("Invalid subscriber action.");
      return Response.json({
        message:
          body.action === "resend"
            ? "Confirmation email sent. Subscription resumes only after the recipient confirms."
            : "Subscriber updated.",
      });
    }
    if (resource === "campaigns") {
      if (body.action === "process")
        return Response.json({
          message: `Queue processed: ${(await processQueue()).processed} sent.`,
        });
      if (body.action === "queue") {
        await queueCampaign(z.string().cuid().parse(body.id));
        return Response.json({
          message:
            "Campaign queued. The scheduled worker will send to verified, subscribed recipients.",
        });
      }
      if (body.action === "delete") {
        const result = await prisma.emailCampaign.deleteMany({
          where: { id: z.string().cuid().parse(body.id), status: "DRAFT" },
        });
        if (!result.count)
          throw new AppError("Only draft campaigns can be deleted.", 409);
        return Response.json({ message: "Draft deleted." });
      }
      const data = campaignSchema.parse(body);
      await prisma.emailCampaign.create({ data: { ...data, type: "MANUAL" } });
      return Response.json({
        message: "Campaign draft saved. Review it before queuing.",
      });
    }
    if (resource === "settings") {
      const data = z
        .object({
          siteTitle: z.string().trim().min(3).max(100),
          contactEmail: z.union([z.literal(""), z.string().email().max(254)]),
          authorStory: z.string().max(20000),
          privacy: z.string().max(20000),
          terms: z.string().max(20000),
          facebook: z.union([
            z.literal(""),
            z.string().url().startsWith("https://"),
          ]),
          instagram: z.union([
            z.literal(""),
            z.string().url().startsWith("https://"),
          ]),
          twitter: z.union([
            z.literal(""),
            z.string().url().startsWith("https://"),
          ]),
          youtube: z.union([
            z.literal(""),
            z.string().url().startsWith("https://"),
          ]),
        })
        .parse(body);
      await prisma.$transaction(
        Object.entries(data).map(([key, value]) =>
          prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
          }),
        ),
      );
      revalidatePath("/", "layout");
      return Response.json({ message: "Settings saved." });
    }
    throw new AppError("Not found.", 404);
  } catch (e) {
    return failure(e);
  }
}
