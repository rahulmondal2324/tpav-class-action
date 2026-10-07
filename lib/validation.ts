import { z } from "zod";
import sanitizeHtml from "sanitize-html";

export const emailSchema = z.string().trim().toLowerCase().email().max(254);
export const subscribeSchema = z.object({
  firstName: z.string().trim().min(1, "Enter your first name.").max(50),
  lastName: z.string().trim().min(1, "Enter your last name.").max(50),
  phoneNumber: z
    .string()
    .trim()
    .max(30)
    .regex(/^\+?[0-9 ()-]+$/, "Enter a valid phone number.")
    .refine((v) => {
      const length = v.replace(/\D/g, "").length;
      return length >= 7 && length <= 15;
    }, "Enter a phone number with 7–15 digits."),
  email: emailSchema,
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});
export const safeUrl = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (v) =>
      !v ||
      /^https:\/\/[^\s]+$/i.test(v) ||
      /^\/assets\/[a-zA-Z0-9/_.-]+$/.test(v),
    "Use an HTTPS image URL or a local asset path.",
  );
export function cleanHtml(value: string) {
  return sanitizeHtml(value, {
    allowedTags: [
      "p",
      "br",
      "h2",
      "h3",
      "h4",
      "strong",
      "em",
      "s",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "hr",
      "code",
      "pre",
    ],
    allowedAttributes: { a: ["href", "title"] },
    allowedSchemes: ["https", "mailto"],
    allowProtocolRelative: false,
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}
export function textOnly(value: string) {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
}
export const blogSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(180)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase words separated by hyphens.",
    ),
  excerpt: z.string().trim().max(500),
  content: z
    .string()
    .max(150000)
    .transform(cleanHtml)
    .refine(
      (v) => textOnly(v).trim().length >= 10,
      "Add at least 10 characters of content.",
    ),
  featuredImage: safeUrl,
  metaTitle: z.string().trim().max(70),
  metaDescription: z.string().trim().max(170),
  keywords: z.string().trim().max(300),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  publishedAt: z
    .string()
    .refine(
      (v) => !v || Number.isFinite(Date.parse(v)),
      "Enter a valid publish date.",
    ),
  notify: z.boolean(),
  updatedAt: z.string().optional(),
});
export const campaignSchema = z.object({
  subject: z.string().trim().min(3).max(180),
  heading: z.string().trim().max(180),
  content: z
    .string()
    .max(100000)
    .transform(cleanHtml)
    .refine(
      (v) => textOnly(v).trim().length >= 10,
      "Add at least 10 characters of content.",
    ),
  buttonText: z.string().trim().max(60),
  buttonUrl: z
    .string()
    .trim()
    .max(2048)
    .refine((v) => !v || /^https:\/\/[^\s]+$/i.test(v), "Use an HTTPS URL."),
});
export function pageNumber(v?: string) {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? Math.min(n, 100000) : 1;
}
