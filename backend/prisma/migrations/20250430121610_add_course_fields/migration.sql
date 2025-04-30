/*
  Warnings:

  - Added the required column `category` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN "level" TEXT NOT NULL DEFAULT 'Beginner';
ALTER TABLE "Course" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'General';
ALTER TABLE "Course" ADD COLUMN "duration" INTEGER NOT NULL DEFAULT 12;

-- Remove defaults after adding the columns
ALTER TABLE "Course" ALTER COLUMN "level" DROP DEFAULT;
ALTER TABLE "Course" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "Course" ALTER COLUMN "duration" DROP DEFAULT;
