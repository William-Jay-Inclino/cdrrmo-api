-- AlterTable
ALTER TABLE "dispatch" ADD COLUMN     "is_cancelled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false;
