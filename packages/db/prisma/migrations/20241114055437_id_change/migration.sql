/*
  Warnings:

  - The primary key for the `Assignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `RecentlyViewed` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Workflows` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Assignment_id_seq";

-- AlterTable
ALTER TABLE "RecentlyViewed" DROP CONSTRAINT "RecentlyViewed_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "RecentlyViewed_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "RecentlyViewed_id_seq";

-- AlterTable
ALTER TABLE "Workflows" DROP CONSTRAINT "Workflows_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Workflows_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Workflows_id_seq";
