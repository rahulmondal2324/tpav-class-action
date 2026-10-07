ALTER TABLE "EmailCampaign" ADD COLUMN "notificationKey" TEXT;
CREATE UNIQUE INDEX "EmailCampaign_notificationKey_key" ON "EmailCampaign"("notificationKey");
ALTER TABLE "EmailLog" ADD COLUMN "lockedUntil" TIMESTAMP(3), ADD COLUMN "firstAttemptAt" TIMESTAMP(3), ADD COLUMN "attempts" INTEGER NOT NULL DEFAULT 0, ADD COLUMN "payload" TEXT;
CREATE TABLE "RequestLimit" ("id" TEXT PRIMARY KEY,"count" INTEGER NOT NULL,"expiresAt" TIMESTAMP(3) NOT NULL);
CREATE INDEX "RequestLimit_expiresAt_idx" ON "RequestLimit"("expiresAt");
CREATE TABLE "rateLimit" ("id" TEXT PRIMARY KEY,"key" TEXT NOT NULL,"count" INTEGER NOT NULL,"lastRequest" BIGINT NOT NULL);
CREATE UNIQUE INDEX "rateLimit_key_key" ON "rateLimit"("key");