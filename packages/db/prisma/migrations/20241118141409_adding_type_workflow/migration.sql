/*
  Warnings:

  - You are about to drop the column `docSetType` on the `workflowData` table. All the data in the column will be lost.
  - Added the required column `workflowType` to the `workflowData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workflows" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;

-- AlterTable
ALTER TABLE "workflowData" DROP COLUMN "docSetType",
ADD COLUMN     "workflowType" TEXT NOT NULL;
