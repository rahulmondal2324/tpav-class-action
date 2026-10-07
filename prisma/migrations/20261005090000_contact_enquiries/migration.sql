CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED');
CREATE TYPE "EnquiryNotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'NOT_CONFIGURED');
CREATE TABLE "Enquiry" (
  "id" TEXT NOT NULL,
  "submissionId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "consentAt" TIMESTAMP(3) NOT NULL,
  "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
  "adminNotes" TEXT NOT NULL DEFAULT '',
  "notificationStatus" "EnquiryNotificationStatus" NOT NULL DEFAULT 'PENDING',
  "notifiedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Enquiry_submissionId_key" ON "Enquiry"("submissionId");
CREATE INDEX "Enquiry_status_createdAt_idx" ON "Enquiry"("status", "createdAt");
CREATE INDEX "Enquiry_createdAt_idx" ON "Enquiry"("createdAt");
