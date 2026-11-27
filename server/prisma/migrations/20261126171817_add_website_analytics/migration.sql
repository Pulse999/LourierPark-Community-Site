-- CreateTable
CREATE TABLE "AdminInvitation" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteVisitor" (
    "id" TEXT NOT NULL,
    "anonymousIdHash" TEXT NOT NULL,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsiteVisitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsitePageView" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "referrerHost" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsitePageView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminInvitation_tokenHash_key" ON "AdminInvitation"("tokenHash");

-- CreateIndex
CREATE INDEX "AdminInvitation_adminUserId_idx" ON "AdminInvitation"("adminUserId");

-- CreateIndex
CREATE INDEX "AdminInvitation_invitedById_idx" ON "AdminInvitation"("invitedById");

-- CreateIndex
CREATE INDEX "AdminInvitation_expiresAt_idx" ON "AdminInvitation"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteVisitor_anonymousIdHash_key" ON "WebsiteVisitor"("anonymousIdHash");

-- CreateIndex
CREATE INDEX "WebsiteVisitor_firstSeenAt_idx" ON "WebsiteVisitor"("firstSeenAt");

-- CreateIndex
CREATE INDEX "WebsiteVisitor_lastSeenAt_idx" ON "WebsiteVisitor"("lastSeenAt");

-- CreateIndex
CREATE INDEX "WebsitePageView_visitorId_createdAt_idx" ON "WebsitePageView"("visitorId", "createdAt");

-- CreateIndex
CREATE INDEX "WebsitePageView_path_createdAt_idx" ON "WebsitePageView"("path", "createdAt");

-- CreateIndex
CREATE INDEX "WebsitePageView_createdAt_idx" ON "WebsitePageView"("createdAt");

-- AddForeignKey
ALTER TABLE "AdminInvitation" ADD CONSTRAINT "AdminInvitation_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminInvitation" ADD CONSTRAINT "AdminInvitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsitePageView" ADD CONSTRAINT "WebsitePageView_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "WebsiteVisitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
