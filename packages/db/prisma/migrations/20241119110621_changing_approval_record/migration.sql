/*
  Warnings:

  - Added the required column `Step` to the `ApprovalRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApprovalRecord" ADD COLUMN     "Step" TEXT NOT NULL,
ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "Workflows" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;
