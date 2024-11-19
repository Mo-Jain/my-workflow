-- AlterTable
ALTER TABLE "Workflows" ADD COLUMN     "approvalDate" TIMESTAMP(3),
ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;
