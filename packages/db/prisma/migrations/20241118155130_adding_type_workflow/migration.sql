/*
  Warnings:

  - You are about to drop the column `Notification` on the `workflowData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Workflows" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;

-- AlterTable
ALTER TABLE "workflowData" DROP COLUMN "Notification",
ADD COLUMN     "notification" BOOLEAN NOT NULL DEFAULT false;
