/*
  Warnings:

  - You are about to drop the column `Email` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `email` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "Email",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "email" TEXT NOT NULL;
