-- AlterTable
ALTER TABLE "File" ADD COLUMN     "workflowId" TEXT;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflows"("id") ON DELETE SET NULL ON UPDATE CASCADE;
