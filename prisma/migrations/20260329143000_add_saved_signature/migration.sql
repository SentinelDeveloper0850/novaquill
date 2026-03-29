-- CreateTable
CREATE TABLE "public"."SavedSignature" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "encryptedPayload" BYTEA NOT NULL,
    "hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedSignature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedSignature_userId_createdAt_idx" ON "public"."SavedSignature"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SavedSignature_userId_hash_key" ON "public"."SavedSignature"("userId", "hash");

-- AddForeignKey
ALTER TABLE "public"."SavedSignature" ADD CONSTRAINT "SavedSignature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
