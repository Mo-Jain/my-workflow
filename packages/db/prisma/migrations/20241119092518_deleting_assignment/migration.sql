/*
  Warnings:

  - Added the required column `workflowName` to the `workflowData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workflows" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;

-- AlterTable
ALTER TABLE "workflowData" ADD COLUMN     "workflowName" TEXT NOT NULL;
