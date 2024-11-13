/*
  Warnings:

  - Added the required column `personalWorkspaceId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_creatorId_fkey";

-- AlterTable
ALTER TABLE "Folder" ALTER COLUMN "creatorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "personalWorkspaceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
