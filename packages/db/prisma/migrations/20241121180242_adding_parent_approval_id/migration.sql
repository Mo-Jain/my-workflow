/*
  Warnings:

  - You are about to drop the column `nextInLineOrder` on the `ApprovalRecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ApprovalRecord" DROP COLUMN "nextInLineOrder",
ADD COLUMN     "parentApprovalId" INTEGER;

-- AlterTable
ALTER TABLE "Workflows" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;

-- AddForeignKey
ALTER TABLE "ApprovalRecord" ADD CONSTRAINT "ApprovalRecord_parentApprovalId_fkey" FOREIGN KEY ("parentApprovalId") REFERENCES "ApprovalRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;
