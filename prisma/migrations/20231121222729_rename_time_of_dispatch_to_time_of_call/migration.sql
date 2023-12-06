/*
  Warnings:

  - You are about to drop the column `time_dispatch` on the `dispatch` table. All the data in the column will be lost.
  - Added the required column `time_of_call` to the `dispatch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dispatch" DROP COLUMN "time_dispatch",
ADD COLUMN     "time_of_call" TIMESTAMP(3) NOT NULL;
