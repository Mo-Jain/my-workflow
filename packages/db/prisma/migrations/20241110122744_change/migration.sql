/*
  Warnings:

  - You are about to drop the column `enterpriseId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `enterpriseId` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the `Enterprise` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_enterpriseId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_enterpriseId_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "enterpriseId";

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "enterpriseId";

-- DropTable
DROP TABLE "Enterprise";
