/*
  Warnings:

  - Added the required column `type` to the `Workflows` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workflows" ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;
