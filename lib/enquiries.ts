import "server-only";
import { prisma } from "./prisma";
import { getSettings } from "./settings";
import { assertEmailConfigured, escapeHtml, sendEmail } from "./email";
import { baseUrl } from "./security";
import { z } from "zod";

export async function notifyEnquiry(id: string) {
  const enquiry = await prisma.enquiry.findUniqueOrThrow({ where: { id } });
  if (enquiry.notificationStatus === "SENT") return "SENT";
  let recipient: string;
  try {
    const settings = await getSettings();
    recipient = z
      .string()
      .email()
      .parse(process.env.CONTACT_NOTIFICATION_EMAIL || settings.contactEmail);
    assertEmailConfigured();
  } catch {
    await prisma.enquiry.update({
      where: { id },
      data: { notificationStatus: "NOT_CONFIGURED" },
    });
    return "NOT_CONFIGURED";
  }
  try {
    // Personal details remain in the authenticated admin area, not in notification emails.
    await sendEmail(
      recipient,
      "New TPAV website enquiry",
      `<div style="font-family:Arial,sans-serif;color:#001c3f;padding:32px"><h1>A new enquiry is ready to review</h1><p>Reference: ${escapeHtml(id)}</p><p><a href="${escapeHtml(baseUrl() + "/admin/enquiries/" + id)}">Open enquiry in administration</a></p><p>Sign in to view the message and contact details.</p></div>`,
      `enquiry-${id}`,
    );
    await prisma.enquiry.update({
      where: { id },
      data: { notificationStatus: "SENT", notifiedAt: new Date() },
    });
    return "SENT";
  } catch {
    await prisma.enquiry.update({
      where: { id },
      data: { notificationStatus: "FAILED" },
    });
    return "FAILED";
  }
}
