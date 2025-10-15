/*
  Warnings:

  - You are about to drop the column `createAt` on the `doctor_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `schedules` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctor_schedules" DROP COLUMN "createAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "createAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
