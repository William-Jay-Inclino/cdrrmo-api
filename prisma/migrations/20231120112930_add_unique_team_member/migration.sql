/*
  Warnings:

  - A unique constraint covering the columns `[team_id,member_id]` on the table `team_members` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "team_members_member_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "team_members_team_id_member_id_key" ON "team_members"("team_id", "member_id");
