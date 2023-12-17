/*
  Warnings:

  - You are about to drop the `skill_certificate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "skill_certificate" DROP CONSTRAINT "skill_certificate_user_skill_id_fkey";

-- AlterTable
ALTER TABLE "user_skill" ADD COLUMN     "image_url" TEXT;

-- DropTable
DROP TABLE "skill_certificate";
