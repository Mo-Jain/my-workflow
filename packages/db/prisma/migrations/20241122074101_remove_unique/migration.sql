-- DropIndex
DROP INDEX "ApprovalRecord_userId_workflowId_key";

-- AlterTable
ALTER TABLE "Workflows" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;
