import { z } from "zod";
export const enquiryStatuses = ["NEW", "IN_PROGRESS", "RESOLVED"] as const;
export const contactSchema = z.object({
  submissionId: z.string().uuid(),
  name: z.string().trim().min(2, "Enter your full name.").max(100),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address.")
    .max(254),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine(
      (v) =>
        !v ||
        (/^\+?[0-9 ()-]+$/.test(v) &&
          v.replace(/\D/g, "").length >= 7 &&
          v.replace(/\D/g, "").length <= 15),
      "Enter a phone number with 7–15 digits, or leave it blank.",
    ),
  subject: z
    .string()
    .trim()
    .min(3, "Enter a subject with at least 3 characters.")
    .max(150),
  message: z
    .string()
    .trim()
    .min(10, "Please include at least 10 characters in your message.")
    .max(5000),
  consent: z.literal(true, {
    error: "Please agree to the privacy notice before submitting.",
  }),
  website: z.string().max(0, "Unable to submit this form.").optional(),
});
export const enquiryUpdateSchema = z.object({
  id: z.string().cuid(),
  status: z.enum(enquiryStatuses),
  adminNotes: z.string().trim().max(10000),
  updatedAt: z.string().datetime(),
});
