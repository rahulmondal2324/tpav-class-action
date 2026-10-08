import "server-only";
import { z } from "zod";
import { Prisma } from "@/app/generated/prisma/client";
const profileSchema = z.object({
  firstName: z.string().max(50),
  lastName: z.string().max(50),
  phoneNumber: z.string().max(30),
  consentAt: z.string().datetime(),
});
type Profile = z.infer<typeof profileSchema>;
import { prisma } from "./prisma";
import { hash, token, baseUrl, AppError, rateLimit } from "./security";
import { assertEmailConfigured, emailFrame, sendEmail } from "./email";

export async function requestVerification(
  name: string,
  email: string,
  profile?: Profile,
) {
  email = email.trim().toLowerCase();
  const current = await prisma.subscriber.findFirst({
    where: {
      email: { equals: email, mode: "insensitive" },
      emailVerified: true,
      subscribed: true,
    },
  });
  if (current) return { status: "already_subscribed" as const };
  assertEmailConfigured();
  await rateLimit("verification:" + email, 1, 120);
  const raw = token();
  const subscriber = await prisma.$transaction(async (tx) => {
    // Serialise concurrent requests for the same normalised email.
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${email}))::text`;
    const existing = await tx.subscriber.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      orderBy: [{ subscribed: "desc" }, { emailVerified: "desc" }],
    });
    if (existing?.emailVerified && existing.subscribed) return null;
    const verification = {
      verificationToken: hash(raw),
      verificationExpiresAt: new Date(Date.now() + 86400000),
    };
    if (existing) {
      const changed = await tx.subscriber.updateMany({
        where: {
          id: existing.id,
          OR: [{ emailVerified: false }, { subscribed: false }],
        },
        data: {
          ...verification,
          ...(profile ? { pendingProfile: profile } : {}),
        },
      });
      if (!changed.count) return null;
      return tx.subscriber.findUniqueOrThrow({ where: { id: existing.id } });
    }
    return tx.subscriber.create({
      data: {
        name,
        email,
        ...(profile
          ? {
              firstName: profile.firstName,
              lastName: profile.lastName,
              phoneNumber: profile.phoneNumber,
              consentAt: new Date(profile.consentAt),
              pendingProfile: profile,
            }
          : {}),
        verificationToken: hash(raw),
        verificationExpiresAt: new Date(Date.now() + 86400000),
        unsubscribeToken: token(),
      },
    });
  });
  if (!subscriber) return { status: "already_subscribed" as const };
  const url = `${baseUrl()}/verify?token=${raw}`;
  try {
    await sendEmail(
      email,
      "Confirm your Class Action Against TPAV subscription",
      emailFrame(
        "Confirm your email",
        "<p>Please confirm that you would like to receive Class Action Against TPAV news and updates. This link expires in 24 hours. You do not need an account or password.</p>",
        "Confirm subscription",
        url,
      ),
      `verify-${subscriber.id}-${hash(raw)}`,
    );
  } catch (error) {
    await prisma.subscriber.updateMany({
      where: { id: subscriber.id, verificationToken: hash(raw) },
      data: { verificationToken: null, verificationExpiresAt: null },
    });
    throw error;
  }
  return { status: "verification_sent" as const };
}
export async function verifySubscription(raw: string) {
  const current = await prisma.subscriber.findUnique({
    where: { verificationToken: hash(raw) },
    select: { pendingProfile: true },
  });
  const profile = profileSchema.safeParse(current?.pendingProfile);
  const result = await prisma.subscriber.updateMany({
    where: {
      verificationToken: hash(raw),
      verificationExpiresAt: { gt: new Date() },
    },
    data: {
      ...(profile.success
        ? {
            firstName: profile.data.firstName,
            lastName: profile.data.lastName,
            phoneNumber: profile.data.phoneNumber,
            name: `${profile.data.firstName} ${profile.data.lastName}`,
            consentAt: new Date(profile.data.consentAt),
          }
        : {}),
      pendingProfile: Prisma.DbNull,
      emailVerified: true,
      subscribed: true,
      verifiedAt: new Date(),
      unsubscribedAt: null,
      verificationToken: null,
      verificationExpiresAt: null,
    },
  });
  if (!result.count)
    throw new AppError(
      "This verification link is invalid, expired, or has already been used. Request a new email below.",
      410,
    );
}
export async function unsubscribe(raw: string) {
  const result = await prisma.subscriber.updateMany({
    where: { unsubscribeToken: raw },
    data: {
      subscribed: false,
      unsubscribedAt: new Date(),
      verificationToken: null,
      verificationExpiresAt: null,
    },
  });
  if (!result.count)
    throw new AppError(
      "This unsubscribe link is invalid. Please use the link in your latest email.",
      404,
    );
}
