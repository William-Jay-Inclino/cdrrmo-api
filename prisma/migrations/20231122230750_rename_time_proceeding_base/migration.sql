/*
  Warnings:

  - You are about to drop the column `time_arrival` on the `dispatch` table. All the data in the column will be lost.
  - You are about to drop the column `time_arrival_to_base` on the `dispatch` table. All the data in the column will be lost.
  - You are about to drop the column `time_back_to_base` on the `dispatch` table. All the data in the column will be lost.
  - You are about to drop the column `time_proceeding` on the `dispatch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dispatch" DROP COLUMN "time_arrival",
DROP COLUMN "time_arrival_to_base",
DROP COLUMN "time_back_to_base",
DROP COLUMN "time_proceeding",
ADD COLUMN     "time_arrival_base" TIMESTAMP(3),
ADD COLUMN     "time_arrival_scene" TIMESTAMP(3),
ADD COLUMN     "time_proceeding_base" TIMESTAMP(3),
ADD COLUMN     "time_proceeding_scene" TIMESTAMP(3);
