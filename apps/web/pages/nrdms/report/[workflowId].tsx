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
import { useParams } from "next/navigation"
import { formatDate } from "@/components/StartWorkflow"

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
  name: string;
  initiator: string;
  startDate: Date;
  companyName?: string;
  department?: string;
  site?: string;
  workflowType?: string;
  docSetType: string;
  referenceNumber?: string;
  currentStep: string;
  currentAssignee?: string ;
}

interface ApprovalRecord {
  id:string;
  step:string;
  userName:string;
  assignedDate:string;
  approvalDate?:string;
  status:string;
  comments?:string;
  userId:string;
}

interface File {
  id: string,
  name: string,
}

export default function Component() {
  const [workflow,setWorkflow] = useState<Workflow>();
  const [approvals,setApprovals] = useState<ApprovalRecord[]>([]);
  const [files,setFiles] = useState<File[]>([]);
  const workflowIdObj = useParams();


  async function fetchData() {
    if(!workflowIdObj || !workflowIdObj?.workflowId ) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/workflowdata/${workflowIdObj.workflowId}`,{
        headers:{
          authorization : `Bearer `+ localStorage.getItem('token')
        }
      })

      const item = res.data.workflowData;
      console.log(item);
      const workflowData = {
        id: item.id,
        name: item.workflow.workflowName,
        initiator: item.workflow.creator.name,
        startDate: item.workflow.startDate,
        companyName: item.companyName,
        department: item.department,
        site: item.site,
        workflowType: item.workflowType,
        docSetType: item.workflow.type,
        referenceNumber: item.referenceNumber,
        currentStep: item.workflow.currentStep,
        currentAssignee: item.workflow.currentAssigneeUser ? item.workflow.currentAssigneeUser.name : null,
      }
      console.log(res.data.workflowData);
      setWorkflow(workflowData);
      const approvalData = res.data.workflowData.workflow.approvers.map((item:any) => ({
        id: item.order,
        step: item.step,
        userName: item.user.name,
        userId: item.userId,
        assignedDate: item.assignedDate,
        approvalDate: item.approvalDate,
        status: item.status,
        comments: item.comments,
      }));
      console.log(approvalData);
      console.log(res.data.workflowData.workflow.approvers);
      setApprovals(approvalData);

      const res1 = await axios.get(`${BASE_URL}/api/v1/workflow/${workflowIdObj.workflowId}`,{
                    headers:{
                      authorization : `Bearer `+ localStorage.getItem('token')
                    }
                  })

      const filesData = res1.data.workflow.files.map((item:any) => ({
        id: item.id,
        name: item.name,
      }));
      console.log(filesData);
      setFiles(filesData);
    }
    catch (error) {
      console.log(error);
    }
  }
   
  useEffect(() => {
    fetchData();
  }, [workflowIdObj]);

  function getNoOfDays(approvalDate:string | null | undefined,assignedDate:string | null | undefined) :string{
    if(!approvalDate || !assignedDate) return "NA";
    const daysTaken = Math.ceil((new Date(approvalDate).getTime() - new Date(assignedDate).getTime()) / (1000 * 3600 * 24));
    return daysTaken.toString() ;
  }
  
  
  function dateformat(date:string | undefined) {
    if(!date) return "NA";
    return date.split('T')[0]+" "+date.split('T')[1].slice(0,5)
  }


  if(!workflow) return <div>Loading...</div>
  
  const getComments = (comments:string) => {
    const commentsArr = comments.split('\n');
    return (
      <div>
        {
          commentsArr.map((comment, index) => (
            <div key={index} className="text-sm text-gray-600 p-1">
              {comment}
            </div>
          ))
        }
      </div>
    )
  }

  const processComments = (comment: string | undefined | null, approvedDate:string | null | undefined, step:string) => {
    if(!comment || comment === "") return "NA";
    const commentArr = comment.split('\hl');
    return (
      <div>
        <div>
          {getComments(commentArr[0])}
        </div>
        {commentArr[1] && approvedDate &&
        <div className="text-sm text-gray-600 p-1 border-t border-gray-400">
          <span>Reviewer Comments Date: {formatDate(new Date(approvedDate))} Step Name: {step}: </span>
          {commentArr[1]}
        </div>}
      </div>
    )
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
          <h1 className="text-lg font-semibold">Workflow Name : {workflow?.name}</h1>
          <div className="text-base">
              <div>Initiator: {workflow?.initiator}</div>
              <div>Initiated Date: {formatDate(new Date(workflow?.startDate ?? new Date()))}</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-0 m-4 text-sm">
        <div className="bg-emerald-500 text-white  col-span-1 w-fit justify-self-end">
            <div className="border-[1px] border-black p-1">Company</div>
            <div className="border-[1px] border-black p-1">Department</div>
            <div className="border-[1px] border-black p-1">Site</div>
            <div className="border-[1px] border-black p-1">Workflow Type</div>
            <div className="border-[1px] border-black p-1">DocSet Type</div>
            <div className="border-[1px] border-black p-1">Reference Number</div>
            <div className="border-[1px] border-black p-1">Pending at Tasks</div>
            <div className="border-[1px] border-black p-1">Pending at Tasks Performer</div>
        </div>
        <div className=" col-span-1 w-fit">
            <div className="border-[1px] border-black p-1">{workflow.companyName ? workflow.companyName :"Pending"}</div>
            <div className="border-[1px] border-black p-1">{workflow.department ? workflow.department :"Pending"}</div>
            <div className="border-[1px] border-black p-1">{workflow.site ? workflow.site :"Pending"}</div>
            <div className="border-[1px] border-black p-1">{workflow.workflowType ? workflow.workflowType :"Pending"}</div>
            <div className="border-[1px] border-black p-1">{workflow.docSetType ? workflow.docSetType :"Pending"}</div>
            <div className="border-[1px] border-black p-1">{workflow.referenceNumber ? workflow.referenceNumber :"Pending"}</div>
            <div className="border-[1px] border-black p-1">{workflow.currentStep ? workflow.currentStep :"Pending"}</div>
            <div className="border-[1px] border-black p-1 min-h-[32px]"> {(workflow?.currentStep === "Approved" || workflow?.currentStep === "Rejected") ? workflow.currentStep : workflow.currentAssignee }</div>
        </div>
     
        <div></div>
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
            
          </div>
        </div>

        {/* Search Fields */}
        <div className="grid grid-cols-7 gap-2">
          <Input placeholder="Search Step" className="h-8" />
          <Input placeholder="Search Approver" className="h-8" />
          <Input placeholder="Search Assigned Date" className="h-8" />
          <Input placeholder="Search Approved Date" className="h-8" />
          <Input placeholder="Search Task Status" className="h-8" />
          <Input placeholder="Search No. of Days" className="h-8" />
          <Input placeholder="Search Task Comments" className="h-8" />
        </div>
      </div>

      {/* Table */}
      <div className="p-4">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100">
                <TableHead className="w-[180px] text-center">Step</TableHead>
                <TableHead className="text-center">Approver</TableHead>
                <TableHead className="text-center max-w-[80px] ">Assigned Date</TableHead>
                <TableHead className="text-center max-w-[80px]">Approved Date</TableHead>
                <TableHead className="text-center">Task Status</TableHead>
                <TableHead className="text-center">No. of Days</TableHead>
                <TableHead className="text-center">Task Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvals.map((report) => (
                <TableRow key={report.id} className={`${report.status==="Forwarded" || report.status==="Sent for review"? "bg-pink-100":""}`}>
                  <TableCell className="max-w-100px text-wrap">{report.step}</TableCell>
                  <TableCell className="">{report.userName}</TableCell>
                  <TableCell className="max-w-[80px]">{dateformat(report.assignedDate)}</TableCell>
                  <TableCell className=" max-w-[80px]">{dateformat(report.approvalDate)}</TableCell>
                  {/* Due to bg defined in table row below css is not applicable */}
                  <TableCell
                      className="w-[120px]"
                      style={{ backgroundColor: report.status === "In Progress" ? "#34D399" : "inherit" }} // Tailwind green-400 hex
                    >
                      {report.status}
                    </TableCell>
                  <TableCell className="text-center">{getNoOfDays(report.approvalDate,report.assignedDate)}</TableCell>
                  <TableCell className="max-w-[200px] whitespace-wrap">{processComments(report.comments,report.approvalDate,report.step)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <h1 className="text-lg font-semibold mt-8 mb-6">Attachments:</h1>
        <Button className="m-1">Download All Attachment</Button>
        <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100">
                <TableHead className="max-w-300px text-center">Data ID</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Uploaded By</TableHead>
                <TableHead className="text-center">Uploaded Date</TableHead>
                <TableHead className="text-center">Modified Date</TableHead>
                <TableHead className="text-center">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="max-w-[180px] ">{file.id}</TableCell>
                  <TableCell className=" cursor-pointer underline">{file.name}</TableCell>
                  <TableCell className="">{workflow?.initiator}</TableCell>
                  <TableCell className="">{formatDate(new Date(workflow?.startDate ?? new Date()))}</TableCell>
                  <TableCell className="">{formatDate(new Date(workflow?.startDate ?? new Date()))}</TableCell>
                  <TableCell className="">NA</TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
            </Table>
        
      </div>
    </div>
  )
}