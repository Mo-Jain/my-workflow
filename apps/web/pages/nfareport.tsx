import * as React from "react"
import { Download, FileText, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import logo from "../public/logo.png";
import Image from "next/image";

// Sample data - in a real app this would come from your backend
const reports = [
  {
    id: 1,
    workflowTitle: "30079647 - NFA WF - 04/Nov/2024 03:53 PM",
    workflowType: "Pending",
    company: "Pending",
    department: "Pending",
    site: "Pending",
    docSetType: "NFA",
    workflowName: "",
    clauseNumber: "NA",
    initiatedBy: "Jain Mohit (30079647)",
    initiatedDate: "04/Nov/2024 03:53:39 PM",
    completedDate: "NA",
    daysTaken: "NA",
    status: "Executing"
  },
  {
    id: 2,
    workflowTitle: "30079647-Letters-1980-OPS-Mundra-2023-12-00001",
    workflowType: "Flexi-Flow",
    company: "KUTCH COPPER LTD",
    department: "Operations",
    site: "Mundra",
    docSetType: "Letters",
    workflowName: "Approval for delay in invoice processing",
    clauseNumber: "NA",
    initiatedBy: "Jain Mohit (30079647)",
    initiatedDate: "28/Dec/2023 09:59:46 AM",
    completedDate: "16/Jan/2024 04:14:46 PM",
    daysTaken: "19",
    status: "Completed"
  }
]

export default function NFAReport() {
  return (
    <div className="min-h-screen"
        style={{
            backgroundColor: '#ffffff', // Light theme background color
            color: '#171717', // Light theme text color
        }}>
      {/* Header */}
      <div className="bg-emerald-500 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image 
              src={logo} 
              width={100}
              height={70}
              alt="Adani Natural Resources" 
            />
            <span className="text-sm">Natural Resources</span>
          </div>
          <h1 className="text-xl font-semibold">NFA and Letters Report</h1>
          <span className="text-lg">30079647</span>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-8">
              Column visibility
            </Button>
            <Button variant="outline" className="h-8">
              Export To Excel
            </Button>
            <Button variant="outline" className="h-8">
              PDF
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select defaultValue="25">
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">entries</span>
          </div>
        </div>

        {/* Search Fields */}
        <div className="grid grid-cols-7 gap-2">
          <Input placeholder="Search Workflow Title" className="h-8" />
          <Input placeholder="Search Workflow Type" className="h-8" />
          <Input placeholder="Search Company" className="h-8" />
          <Input placeholder="Search Department" className="h-8" />
          <Input placeholder="Search Site" className="h-8" />
          <Input placeholder="Search Doc-Set Type" className="h-8" />
          <Input placeholder="Search Workflow Name" className="h-8" />
        </div>
      </div>

      {/* Table */}
      <div className="p-4">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Workflow Title</TableHead>
                <TableHead className="whitespace-nowrap">Workflow Type</TableHead>
                <TableHead className="whitespace-nowrap">Company</TableHead>
                <TableHead className="whitespace-nowrap">Department</TableHead>
                <TableHead className="whitespace-nowrap">Site</TableHead>
                <TableHead className="whitespace-nowrap">Doc-Set Type</TableHead>
                <TableHead className="whitespace-nowrap">Workflow Name</TableHead>
                <TableHead className="whitespace-nowrap">Clause Number</TableHead>
                <TableHead className="whitespace-nowrap">Initiated By</TableHead>
                <TableHead className="whitespace-nowrap">Initiated Date</TableHead>
                <TableHead className="whitespace-nowrap">Completed Date</TableHead>
                <TableHead className="whitespace-nowrap">Days Taken</TableHead>
                <TableHead className="whitespace-nowrap">Workflow Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="whitespace-nowrap">{report.workflowTitle}</TableCell>
                  <TableCell className="whitespace-nowrap">{report.workflowType}</TableCell>
                  <TableCell className="whitespace-nowrap">{report.company}</TableCell>
                  <TableCell className="whitespace-nowrap">{report.department}</TableCell>
                  <TableCell className="whitespace-nowrap">{report.site}</TableCell>
                  <TableCell className="whitespace-nowrap">{report.docSetType}</TableCell>
                  <TableCell className="whitespace-nowrap">{report.workflowName}</TableCell>
                  <TableCell className="whitespace-nowrap">{report.clauseNumber}</TableCell>
                  <TableCell className="whitespace-nowrap">{report.initiatedBy}</TableCell>
                  <TableCell className="whitespace-nowrap">{report.initiatedDate}</TableCell>
                  <TableCell className="whitespace-nowrap">{report.completedDate}</TableCell>
                  <TableCell className="whitespace-nowrap">{report.daysTaken}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge 
                      variant="outline" 
                      className={
                        report.status === "Completed" 
                          ? "bg-green-50 text-green-700" 
                          : "bg-blue-50 text-blue-700"
                      }
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing 1 to 6 of 6 entries
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-8" disabled>
              Previous
            </Button>
            <Button variant="outline" className="h-8 bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline" className="h-8" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}