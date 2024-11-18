/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Workflows` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Workflows" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Workflows_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Workflows_id_key" ON "Workflows"("id");
