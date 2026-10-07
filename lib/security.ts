import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export class AppError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export function baseUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.BETTER_AUTH_URL;
  if (!raw) throw new AppError("The site URL is not configured.", 503);
  const url = new URL(raw);
  if (
    process.env.NODE_ENV === "production" &&
    url.protocol !== "https:" &&
    url.hostname !== "localhost" &&
    url.hostname !== "127.0.0.1"
  )
    throw new AppError("HTTPS is required.", 503);
  return url.origin;
}
export function token() {
  return randomBytes(32).toString("hex");
}
export function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
export function validToken(v: unknown): v is string {
  return typeof v === "string" && /^[a-f0-9]{64}$/.test(v);
}
export function secureEqual(a: string, b: string) {
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (
    !session ||
    !session.user.role?.split(",").includes("admin") ||
    session.user.banned
  )
    throw new AppError(
      "Your admin session has expired. Please sign in again.",
      401,
    );
  return session;
}
export function checkOrigin(request: Request) {
  if (request.headers.get("origin") !== baseUrl())
    throw new AppError(
      "This request could not be verified. Reload the page and try again.",
      403,
    );
}
// Atomic, shared PostgreSQL limits work across serverless instances.
export async function rateLimit(
  key: string,
  max: number,
  windowSeconds: number,
) {
  const bucket = Math.floor(Date.now() / (windowSeconds * 1000));
  const id = hash(key) + ":" + bucket;
  const rows = await prisma.$queryRaw<
    { count: number }[]
  >`INSERT INTO "RequestLimit" ("id","count","expiresAt") VALUES (${id},1,${new Date((bucket + 1) * windowSeconds * 1000)}) ON CONFLICT ("id") DO UPDATE SET "count"="RequestLimit"."count"+1 RETURNING "count"`;
  if (rows[0].count > max)
    throw new AppError("Too many attempts. Please try again later.", 429);
}
export function requestIp(request: Request) {
  return process.env.TRUST_PROXY === "true"
    ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    : "shared";
}
