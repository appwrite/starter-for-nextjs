-- AlterTable
ALTER TABLE "users" ADD COLUMN     "menteeGroupId" INTEGER;

-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,
    "mentorId" TEXT,
    "info" TEXT,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "groups_mentorId_key" ON "groups"("mentorId");

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_menteeGroupId_fkey" FOREIGN KEY ("menteeGroupId") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
