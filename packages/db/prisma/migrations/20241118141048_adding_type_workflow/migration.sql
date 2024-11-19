/*
  Warnings:

  - You are about to drop the column `workflowName` on the `workflowData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Workflows" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;

-- AlterTable
ALTER TABLE "workflowData" DROP COLUMN "workflowName";
