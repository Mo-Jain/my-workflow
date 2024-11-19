/*
  Warnings:

  - The primary key for the `ApprovalRecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ApprovalRecord` table. All the data in the column will be lost.
  - Added the required column `userId` to the `workflowData` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ApprovalRecord_userId_workflowId_key";

-- AlterTable
ALTER TABLE "ApprovalRecord" DROP CONSTRAINT "ApprovalRecord_pkey",
DROP COLUMN "id",
ADD COLUMN     "assignedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "comments" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 1,
ADD CONSTRAINT "ApprovalRecord_pkey" PRIMARY KEY ("userId", "workflowId");

-- AlterTable
ALTER TABLE "Workflows" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;

-- AlterTable
ALTER TABLE "workflowData" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "workflowData" ADD CONSTRAINT "workflowData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
