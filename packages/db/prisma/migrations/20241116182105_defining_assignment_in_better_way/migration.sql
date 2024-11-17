/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `Workflows` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Workflows` table. All the data in the column will be lost.
  - Added the required column `assigneeId` to the `Workflows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `Workflows` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Workflows" DROP CONSTRAINT "Workflows_userId_fkey";

-- AlterTable
ALTER TABLE "Workflows" DROP COLUMN "assignedTo",
DROP COLUMN "userId",
ADD COLUMN     "assigneeId" TEXT NOT NULL,
ADD COLUMN     "creatorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Workflows" ADD CONSTRAINT "Workflows_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflows" ADD CONSTRAINT "Workflows_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
