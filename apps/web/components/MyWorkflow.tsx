import { ChevronDown, ExternalLink, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Sample data - in a real app this would come from your backend
const workflows = [
  {
    id: 1,
    status: "on time",
    workflow: "30079647 - NFA WF - 10/Sep/2024 03:16",
    currentStep: "NFA Form - 10/Sep/2024 03:16 PM",
    assignedTo: "Mohit Jain",
    startDate: "September 10, 2024"
  },
  {
    id: 2,
    status: "on time",
    workflow: "30079647 - NFA WF - 04/Nov/2024 03:53",
    currentStep: "NFA Form - 04/Nov/2024 03:53 PM",
    assignedTo: "Mohit Jain",
    startDate: "November 4, 2024"
  }
]

export default function Component(
  {onClose}:
  {onClose:()=>void}
) {
  return (
    <div className=" bg-background text-black">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ChevronDown className="h-4 w-4" />
            <h1 className="text-lg font-medium">My Workflows</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-full">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead>Step Due Date</TableHead>
                <TableHead>Workflow</TableHead>
                <TableHead>Current Step</TableHead>
                <TableHead>Assigned to</TableHead>
                <TableHead>Start Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm text-muted-foreground">
                        {workflow.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <span className="text-sm text-blue-600">
                      {workflow.workflow}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {workflow.currentStep}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-blue-600">
                      {workflow.assignedTo}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {workflow.startDate}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}