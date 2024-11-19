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
import logo from "../../../public/logo.png";
import Image from "next/image";
import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_URL } from "@/next.config"
import { get } from "http"
import { useRouter } from "next/router"

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

interface Workflow {
  id: number;
  workflowTitle: string;
  workflowType: string;
  companyName: string;
  department: string;
  site: string;
  docSetType: string;
  workflowName: string;
  clauseNumber: string;
  initiatedBy: string;
  initiatedDate: string; 
  completedDate: string; 
  daysTaken: string; 
  status: string;
}


export default function NFAReport() {
  const [reportData,setReportData] = useState<Workflow[]>([]);
  const router = useRouter();

  async function fetchData() {
    const res = await axios.get(`${BASE_URL}/api/v1/workflow/report`,{
      headers:{
        authorization : `Bearer `+ localStorage.getItem('token')
      }
    });
    function daysTaken(startDate:Date ,approvalDate:Date | null | undefined) :string{
      if(!approvalDate) return "NA";
      const daysTaken = Math.ceil((approvalDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
      return daysTaken.toString() ;
    }
    const reportDataList = res.data.workflowReport.map((workflowItem:any) => ({
      id: workflowItem.id,
      workflowTitle: workflowItem.workflowName,
      workflowType: workflowItem.workflowData[0]? workflowItem.workflowData[0].workflowType: "pending",
      companyName: workflowItem.workflowData[0] ? workflowItem.workflowData[0].companyName : "pending",
      department: workflowItem.workflowData[0] ? workflowItem.workflowData[0].department : "pending",
      site: workflowItem.workflowData[0] ? workflowItem.workflowData[0].site : "pending",
      workflowName: workflowItem.workflowData[0] ? workflowItem.workflowData[0].workflowName : "pending",
      clauseNumber: workflowItem.workflowData[0] ? workflowItem.workflowData[0].clauseNumber : "NA",
      docSetType: workflowItem.type,
      initiatedBy: workflowItem.creator.name,
      initiatedDate:  workflowItem.startDate,
      completedDate:  workflowItem.approvalDate,
      daysTaken:  daysTaken(workflowItem.startDate,workflowItem.approvalDate),
      status: workflowItem.status
     }))
    setReportData(reportDataList);
  }
  useEffect(() => {
    fetchData();
  }, []);

  function getStyle(status:string) :string{
    if(status === "Completed"){
      return "bg-green-50 text-green-700"
    }
    else if(status === "on time"){
      return "bg-blue-50 text-blue-700"
    }
    else{
      return "bg-red-50 text-red-700"
    }
  }
  

  return (
    <div className="min-h-screen"
        style={{
            backgroundColor: '#ffffff', // Light theme background color
            color: '#171717', // Light theme text color
        }}>
      {/* Header */}
      <div className="bg-emerald-500 text-white p-4">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1 transition-opacity duration-300 `}>
            <Image 
              src={logo} 
              width={100}
              height={70}
              alt="Adani Natural Resources" 
            />
            <div className="h-10 border-[1px] border-gray-600 mr-2"></div>
            <span className="text-white-600 text-sm text-wrap w-6 text-center">Natural Resources</span>
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
                <TableHead className="w-500px text-center">Workflow Title</TableHead>
                <TableHead className="text-center">Workflow Type</TableHead>
                <TableHead className="text-center">Company</TableHead>
                <TableHead className="text-center">Department</TableHead>
                <TableHead className="text-center">Site</TableHead>
                <TableHead className="text-center">Doc-Set Type</TableHead>
                <TableHead className="text-center">Workflow Name</TableHead>
                <TableHead className="text-center">Clause Number</TableHead>
                <TableHead className="text-center">Initiated By</TableHead>
                <TableHead className="text-center ">Initiated Date</TableHead>
                <TableHead className="text-center">Completed Date</TableHead>
                <TableHead className="text-center">Days Taken</TableHead>
                <TableHead className="text-center">Workflow Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className={`max-w-[22 0px] text-wrap  ${report.status !== "stopped" ? "underline cursor-pointer" : ""}`} onClick={() => {
                                                                                                if(report.status !== "stopped"){
                                                                                                  router.push('/nrdms/report/'+report.id)
                                                                                                }
                                                                                                }}>{report.workflowTitle}</TableCell>
                  <TableCell className="text-center">{report.workflowType}</TableCell>
                  <TableCell className="text-center">{report.companyName}</TableCell>
                  <TableCell className="text-center">{report.department}</TableCell>
                  <TableCell className="text-center">{report.site}</TableCell>
                  <TableCell className="text-center">{report.docSetType}</TableCell>
                  <TableCell className="text-center">{report.workflowName}</TableCell>
                  <TableCell className="text-center">{report.clauseNumber}</TableCell>
                  <TableCell className="text-center">{report.initiatedBy}</TableCell>
                  <TableCell className="text-center">{report.initiatedDate.split('T')[0]+" "+report.initiatedDate.split('T')[1].slice(0,5)}</TableCell>
                  <TableCell className="text-center">{report.completedDate ? report.completedDate.split('T')[0]+" "+report.completedDate.split('T')[1].slice(0,5) : "NA"}</TableCell>
                  <TableCell className="text-center">{report.daysTaken}</TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant="outline" 
                      className={
                        getStyle(report.status)
                      }
                    >
                      {report.status.toLocaleUpperCase()}
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