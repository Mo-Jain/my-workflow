-- AlterTable
ALTER TABLE "Workflows" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;

-- CreateTable
CREATE TABLE "workflowData" (
    "id" TEXT NOT NULL,
    "workflowId" INTEGER NOT NULL,
    "workflowName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "sbu" TEXT NOT NULL,
    "clauseNumber" TEXT NOT NULL,
    "workflowType" TEXT NOT NULL,
    "docSetType" TEXT NOT NULL,
    "subject" TEXT,
    "to" TEXT,
    "project" TEXT,
    "remarks" TEXT,
    "finalApproval" BOOLEAN NOT NULL DEFAULT false,
    "Notification" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "workflowData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "workflowData" ADD CONSTRAINT "workflowData_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
