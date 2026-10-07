import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/contact-validation";
import { checkOrigin, rateLimit, requestIp, AppError } from "@/lib/security";
import { jsonBody, failure } from "@/lib/http";
import { notifyEnquiry } from "@/lib/enquiries";
export const maxDuration = 30;
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const { submissionId, phone, name, email, subject, message } =
      contactSchema.parse(await jsonBody(request));
    const data = { name, email, subject, message };
    await rateLimit("contact-ip:" + requestIp(request), 10, 3600);
    const result = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${submissionId}))::text`;
      const existing = await tx.enquiry.findUnique({ where: { submissionId } });
      if (existing) {
        if (
          existing.email !== data.email ||
          existing.name !== data.name ||
          existing.subject !== data.subject ||
          existing.message !== data.message ||
          (existing.phone || "") !== phone
        )
          throw new AppError(
            "This submission was already received. Reload the page to send a new enquiry.",
            409,
          );
        return { enquiry: existing, created: false };
      }
      const enquiry = await tx.enquiry.create({
        data: {
          ...data,
          phone: phone || null,
          submissionId,
          consentAt: new Date(),
        },
      });
      return { enquiry, created: true };
    });
    if (result.created) {
      try {
        await notifyEnquiry(result.enquiry.id);
      } catch {
        console.error(
          "Enquiry saved; notification needs review",
          result.enquiry.id,
        );
      }
    }
    return Response.json(
      {
        message: `Thank you. Your enquiry has been received. Reference: ${result.enquiry.id}`,
        reference: result.enquiry.id,
      },
      { status: result.created ? 201 : 200 },
    );
  } catch (error) {
    return failure(error);
  }
}
