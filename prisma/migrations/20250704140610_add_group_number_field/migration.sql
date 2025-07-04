/*
  Warnings:

  - A unique constraint covering the columns `[groupNumber]` on the table `groups` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `groupNumber` to the `groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "groupNumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "groups_groupNumber_key" ON "groups"("groupNumber");
