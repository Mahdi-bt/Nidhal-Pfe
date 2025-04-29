/*
  Warnings:

  - A unique constraint covering the columns `[enrollmentId]` on the table `PaymentIntent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PaymentIntent" ADD COLUMN     "enrollmentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentIntent_enrollmentId_key" ON "PaymentIntent"("enrollmentId");

-- AddForeignKey
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
