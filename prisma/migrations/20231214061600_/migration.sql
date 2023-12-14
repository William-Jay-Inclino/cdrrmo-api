/*
  Warnings:

  - You are about to drop the `barts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `csos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `emergencies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `emergency_contacts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `locations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `skill_certificates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `training_skills` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_skills` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "dispatch" DROP CONSTRAINT "dispatch_dispatcher_id_fkey";

-- DropForeignKey
ALTER TABLE "dispatch" DROP CONSTRAINT "dispatch_emergency_id_fkey";

-- DropForeignKey
ALTER TABLE "dispatch" DROP CONSTRAINT "dispatch_team_id_fkey";

-- DropForeignKey
ALTER TABLE "emergency_contacts" DROP CONSTRAINT "emergency_contacts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "skill_certificates" DROP CONSTRAINT "skill_certificates_user_skill_id_fkey";

-- DropForeignKey
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_member_id_fkey";

-- DropForeignKey
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_team_id_fkey";

-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_team_leader_id_fkey";

-- DropForeignKey
ALTER TABLE "user_skills" DROP CONSTRAINT "user_skills_training_skill_id_fkey";

-- DropForeignKey
ALTER TABLE "user_skills" DROP CONSTRAINT "user_skills_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_bart_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_cso_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_na_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_po_id_fkey";

-- DropTable
DROP TABLE "barts";

-- DropTable
DROP TABLE "csos";

-- DropTable
DROP TABLE "emergencies";

-- DropTable
DROP TABLE "emergency_contacts";

-- DropTable
DROP TABLE "locations";

-- DropTable
DROP TABLE "nas";

-- DropTable
DROP TABLE "pos";

-- DropTable
DROP TABLE "skill_certificates";

-- DropTable
DROP TABLE "team_members";

-- DropTable
DROP TABLE "teams";

-- DropTable
DROP TABLE "training_skills";

-- DropTable
DROP TABLE "user_skills";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "user_id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_level" INTEGER NOT NULL,
    "password_hash" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "gender" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "contact_no" TEXT NOT NULL,
    "blood_type" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "dispatch_status" INTEGER,
    "type" INTEGER NOT NULL,
    "bart_id" TEXT,
    "cso_id" TEXT,
    "po_id" TEXT,
    "na_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team" (
    "id" TEXT NOT NULL,
    "team_leader_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_member" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_skill" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "training_skill_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emergency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bart" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cso" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "po" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "po_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "na" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "na_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_certificate" (
    "id" TEXT NOT NULL,
    "user_skill_id" TEXT NOT NULL,
    "certificateUrl" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skill_certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_contact" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emergency_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL,
    "date_acquired" TIMESTAMP(3) NOT NULL,
    "serial_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "item_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movement" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "movement_type" INTEGER NOT NULL,
    "movement_date" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_movement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_user_id_key" ON "user"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_user_name_key" ON "user"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_first_name_last_name_key" ON "user"("first_name", "last_name");

-- CreateIndex
CREATE UNIQUE INDEX "team_team_leader_id_key" ON "team"("team_leader_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_name_key" ON "team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "team_member_team_id_member_id_key" ON "team_member"("team_id", "member_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_skill_user_id_training_skill_id_key" ON "user_skill"("user_id", "training_skill_id");

-- CreateIndex
CREATE UNIQUE INDEX "training_skill_name_key" ON "training_skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "emergency_name_key" ON "emergency"("name");

-- CreateIndex
CREATE UNIQUE INDEX "bart_name_key" ON "bart"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cso_name_key" ON "cso"("name");

-- CreateIndex
CREATE UNIQUE INDEX "po_name_key" ON "po"("name");

-- CreateIndex
CREATE UNIQUE INDEX "na_name_key" ON "na"("name");

-- CreateIndex
CREATE UNIQUE INDEX "emergency_contact_user_id_mobile_key" ON "emergency_contact"("user_id", "mobile");

-- CreateIndex
CREATE UNIQUE INDEX "location_name_key" ON "location"("name");

-- CreateIndex
CREATE UNIQUE INDEX "item_name_key" ON "item"("name");

-- CreateIndex
CREATE UNIQUE INDEX "item_category_name_key" ON "item_category"("name");

-- AddForeignKey
ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_dispatcher_id_fkey" FOREIGN KEY ("dispatcher_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_emergency_id_fkey" FOREIGN KEY ("emergency_id") REFERENCES "emergency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_bart_id_fkey" FOREIGN KEY ("bart_id") REFERENCES "bart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_cso_id_fkey" FOREIGN KEY ("cso_id") REFERENCES "cso"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_po_id_fkey" FOREIGN KEY ("po_id") REFERENCES "po"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_na_id_fkey" FOREIGN KEY ("na_id") REFERENCES "na"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_team_leader_id_fkey" FOREIGN KEY ("team_leader_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skill" ADD CONSTRAINT "user_skill_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skill" ADD CONSTRAINT "user_skill_training_skill_id_fkey" FOREIGN KEY ("training_skill_id") REFERENCES "training_skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_certificate" ADD CONSTRAINT "skill_certificate_user_skill_id_fkey" FOREIGN KEY ("user_skill_id") REFERENCES "user_skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_contact" ADD CONSTRAINT "emergency_contact_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "item_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
