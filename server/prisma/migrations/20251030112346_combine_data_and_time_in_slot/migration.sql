/*
  Warnings:

  - You are about to drop the column `email` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `Email` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "email",
ADD COLUMN     "Email" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
