-- AlterTable
ALTER TABLE "Workflows" ALTER COLUMN "currentStep" DROP NOT NULL,
ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;
