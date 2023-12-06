/*
  Warnings:

  - You are about to drop the column `is_cancelled` on the `dispatch` table. All the data in the column will be lost.
  - You are about to drop the column `is_completed` on the `dispatch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dispatch" DROP COLUMN "is_cancelled",
DROP COLUMN "is_completed";
