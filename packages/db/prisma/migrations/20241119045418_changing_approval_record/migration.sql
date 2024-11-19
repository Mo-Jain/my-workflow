-- AlterTable
ALTER TABLE "ApprovalRecord" ALTER COLUMN "approvalDate" DROP NOT NULL,
ALTER COLUMN "approvalDate" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Workflows" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;
