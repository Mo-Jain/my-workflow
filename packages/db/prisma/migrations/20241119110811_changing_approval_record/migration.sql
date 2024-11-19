/*
  Warnings:

  - You are about to drop the column `Step` on the `ApprovalRecord` table. All the data in the column will be lost.
  - Added the required column `step` to the `ApprovalRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApprovalRecord" DROP COLUMN "Step",
ADD COLUMN     "step" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Workflows" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;
