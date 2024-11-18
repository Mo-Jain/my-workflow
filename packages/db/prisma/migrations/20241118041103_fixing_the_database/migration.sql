/*
  Warnings:

  - The primary key for the `Assignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dueDate` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Assignment` table. All the data in the column will be lost.
  - The `workflowId` column on the `File` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Workflows` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `assigneeId` on the `Workflows` table. All the data in the column will be lost.
  - The `id` column on the `Workflows` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `workflowId` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "Workflows" DROP CONSTRAINT "Workflows_assigneeId_fkey";

-- AlterTable
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_pkey",
DROP COLUMN "dueDate",
DROP COLUMN "id",
DROP COLUMN "location",
DROP COLUMN "name",
DROP COLUMN "priority",
DROP COLUMN "status",
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "workflowId" INTEGER NOT NULL,
ADD CONSTRAINT "Assignment_pkey" PRIMARY KEY ("userId", "workflowId");

-- AlterTable
ALTER TABLE "File" DROP COLUMN "workflowId",
ADD COLUMN     "workflowId" INTEGER;

-- AlterTable
ALTER TABLE "Workflows" DROP CONSTRAINT "Workflows_pkey",
DROP COLUMN "assigneeId",
ADD COLUMN     "currentAssigneeId" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Workflows_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "ApprovalRecord" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "workflowId" INTEGER NOT NULL,
    "approvalDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApprovalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApprovalRecord_userId_workflowId_key" ON "ApprovalRecord"("userId", "workflowId");

-- AddForeignKey
ALTER TABLE "Workflows" ADD CONSTRAINT "Workflows_currentAssigneeId_fkey" FOREIGN KEY ("currentAssigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRecord" ADD CONSTRAINT "ApprovalRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRecord" ADD CONSTRAINT "ApprovalRecord_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflows"("id") ON DELETE SET NULL ON UPDATE CASCADE;
