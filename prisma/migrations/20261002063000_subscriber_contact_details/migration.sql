ALTER TABLE "Subscriber" ADD COLUMN "firstName" TEXT, ADD COLUMN "lastName" TEXT, ADD COLUMN "phoneNumber" TEXT, ADD COLUMN "consentAt" TIMESTAMP(3), ADD COLUMN "pendingProfile" JSONB;
