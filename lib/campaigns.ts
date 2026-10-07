import "server-only";
import { prisma } from "./prisma";
import { AppError, baseUrl, token } from "./security";
import { assertEmailConfigured, emailFrame, sendEmail } from "./email";
import type { Prisma } from "@/app/generated/prisma/client";

export async function queueCampaign(id: string) {
  assertEmailConfigured();
  await prisma.$transaction((tx) => queueCampaignInTransaction(tx, id));
}
export async function queueCampaignInTransaction(
  tx: Prisma.TransactionClient,
  id: string,
) {
  const campaign = await tx.emailCampaign.findUniqueOrThrow({
    where: { id },
    include: { blog: true },
  });
  if (
    campaign.type === "BLOG_NOTIFICATION" &&
    (!campaign.blog ||
      campaign.blog.status !== "PUBLISHED" ||
      !campaign.blog.publishedAt ||
      campaign.blog.publishedAt > new Date())
  )
    throw new AppError(
      "The linked post must be published before sending this notification.",
      409,
    );
  const claim = await tx.emailCampaign.updateMany({
    where: { id, status: "DRAFT" },
    data: { status: "SENDING" },
  });
  if (!claim.count)
    throw new AppError("This campaign has already been queued or sent.", 409);
  // Snapshot recipient membership in one atomic insert, without loading the list into memory.
  await tx.$executeRaw`INSERT INTO "EmailLog" ("id","campaignId","subscriberId","email","status","createdAt","updatedAt","attempts") SELECT md5(${id} || ':' || "id"), ${id}, "id", "email", 'PENDING'::"EmailLogStatus", (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'), (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'), 0 FROM "Subscriber" WHERE "emailVerified"=true AND "subscribed"=true`;
  const count = await tx.emailLog.count({ where: { campaignId: id } });
  await tx.emailCampaign.update({
    where: { id },
    data: {
      recipientCount: count,
      status: count ? "SENDING" : "SENT",
      sentAt: count ? null : new Date(),
    },
  });
}
export async function processQueue() {
  assertEmailConfigured();
  const started = Date.now();
  let processed = 0;
  // Atomic leases prevent simultaneous cron/manual requests from sending the same log.
  for (let i = 0; i < 10 && Date.now() - started < 40000; i++) {
    const rows = await prisma.$queryRaw<
      { id: string }[]
    >`UPDATE "EmailLog" SET "lockedUntil"=(CURRENT_TIMESTAMP AT TIME ZONE 'UTC')+INTERVAL '2 minutes', "firstAttemptAt"=COALESCE("firstAttemptAt",(CURRENT_TIMESTAMP AT TIME ZONE 'UTC')),"attempts"="attempts"+1 WHERE "id"=(SELECT l."id" FROM "EmailLog" l JOIN "EmailCampaign" c ON c."id"=l."campaignId" WHERE l."status"='PENDING' AND c."status"='SENDING' AND (l."lockedUntil" IS NULL OR l."lockedUntil"<(CURRENT_TIMESTAMP AT TIME ZONE 'UTC')) ORDER BY l."createdAt" FOR UPDATE OF l SKIP LOCKED LIMIT 1) RETURNING "id"`;
    if (!rows.length) break;
    const log = await prisma.emailLog.findUniqueOrThrow({
      where: { id: rows[0].id },
      include: { subscriber: true, campaign: true },
    });
    try {
      if (!log.subscriber?.emailVerified || !log.subscriber.subscribed) {
        await prisma.emailLog.update({
          where: { id: log.id },
          data: {
            status: "FAILED",
            errorMessage: "Skipped: recipient no longer subscribed.",
            lockedUntil: null,
          },
        });
        continue;
      }
      if (
        log.attempts > 5 ||
        (log.firstAttemptAt &&
          Date.now() - log.firstAttemptAt.getTime() > 23 * 3600000)
      ) {
        await prisma.emailLog.update({
          where: { id: log.id },
          data: {
            status: "FAILED",
            errorMessage:
              "Delivery uncertain; retry window closed. Check provider logs before contacting this recipient again.",
            lockedUntil: null,
          },
        });
        continue;
      }
      let payload = log.payload;
      if (!payload) {
        const unsub = log.subscriber.unsubscribeToken || token();
        if (!log.subscriber.unsubscribeToken)
          await prisma.subscriber.update({
            where: { id: log.subscriber.id },
            data: { unsubscribeToken: unsub },
          });
        const unsubscribeUrl = `${baseUrl()}/unsubscribe?token=${unsub}`;
        const c = log.campaign;
        payload = JSON.stringify({
          subject: c.subject,
          html: emailFrame(
            c.heading || c.subject,
            c.content,
            c.buttonText || undefined,
            c.buttonUrl || undefined,
            unsubscribeUrl,
          ),
          unsubscribeUrl,
        });
        await prisma.emailLog.update({
          where: { id: log.id },
          data: { payload },
        });
      }
      const data = JSON.parse(payload) as {
        subject: string;
        html: string;
        unsubscribeUrl: string;
      };
      const providerMessageId = await sendEmail(
        log.email,
        data.subject,
        data.html,
        `campaign-${log.id}`,
        data.unsubscribeUrl,
      );
      await prisma.emailLog.update({
        where: { id: log.id },
        data: {
          status: "SENT",
          sentAt: new Date(),
          providerMessageId,
          errorMessage: null,
          lockedUntil: null,
          payload: null,
        },
      });
      processed++;
    } catch {
      // Keep the immutable payload for Resend idempotency; retry with the same key and body.
      await prisma.emailLog.update({
        where: { id: log.id },
        data: {
          errorMessage: "Delivery attempt failed; queued for retry.",
          lockedUntil: new Date(Date.now() + 120000),
        },
      });
    }
    await new Promise((resolve) => setTimeout(resolve, 600));
  }
  const campaigns = await prisma.emailCampaign.findMany({
    where: { status: "SENDING" },
    take: 100,
    select: { id: true, blogId: true },
  });
  for (const c of campaigns) {
    const groups = await prisma.emailLog.groupBy({
      by: ["status"],
      where: { campaignId: c.id },
      _count: true,
    });
    const count = (status: string) =>
      groups.find((g) => g.status === status)?._count || 0;
    const pending = count("PENDING"),
      sent = count("SENT"),
      failed = count("FAILED");
    await prisma.emailCampaign.updateMany({
      where: { id: c.id, status: "SENDING" },
      data: {
        sentCount: sent,
        failedCount: failed,
        ...(!pending
          ? {
              status: failed ? (sent ? "PARTIAL" : "FAILED") : "SENT",
              sentAt: new Date(),
            }
          : {}),
      },
    });
    if (!pending && c.blogId && !failed)
      await prisma.blog.updateMany({
        where: { id: c.blogId },
        data: {
          emailNotificationSent: true,
          emailNotificationSentAt: new Date(),
        },
      });
  }
  await prisma.requestLimit.deleteMany({
    where: { expiresAt: { lt: new Date(Date.now() - 86400000) } },
  });
  return { processed };
}
