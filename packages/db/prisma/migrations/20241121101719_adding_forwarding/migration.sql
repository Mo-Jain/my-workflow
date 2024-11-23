/*
  Warnings:

  - The primary key for the `ApprovalRecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,workflowId]` on the table `ApprovalRecord` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ApprovalRecord" DROP CONSTRAINT "ApprovalRecord_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "nextInLineOrder" INTEGER,
ADD CONSTRAINT "ApprovalRecord_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Workflows" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;

-- CreateIndex
CREATE UNIQUE INDEX "ApprovalRecord_userId_workflowId_key" ON "ApprovalRecord"("userId", "workflowId");
