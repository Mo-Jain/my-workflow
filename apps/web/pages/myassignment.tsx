import { ArrowLeft, CheckCircle2, FileText, Search, Workflow } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/router"
import { useRecoilValue } from "recoil"
import { assignmentItems } from "@/lib/store/selectors/assignment"
import { getIcon } from "./icon/icon"
import { useState } from "react"
import ApproveWorkflow from "@/components/ApproveWorkflow"
import { Item } from "@/lib/store/atoms/assignment"

// Sample data - in a real app this would come from your backend
const assignmentsList = [
  {
    id: 1,
    name: "NFA Form - 04/Nov/2024 03:53 PM",
    location: "30079647 - NFA WF - 04/Nov/2024 03:53 PM",
    dueDate: "",
    priority: "Medium",
    status: "OK",
    from: "Mohit Jain"
  },
  {
    id: 2,
    name: "NFA Form - 10/Sep/2024 03:16 PM",
    location: "30079647 - NFA WF - 10/Sep/2024 03:16 PM",
    dueDate: "",
    priority: "Medium",
    status: "OK",
    from: "Mohit Jain"
  }
]

export default function MyAssignment() {
  const assignments = useRecoilValue(assignmentItems);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [clickedAssignment, setClickedAssignment] = useState<Item>();

  function handleClick(id: string) {
    const assignment = assignments.filter(assignment => assignment.id == id)[0];
    if(!assignment) return;
    if(assignment.name.includes("Form")){
      router.push(`/nrdms/form/${id}`);
    }
    else{
      setClickedAssignment(assignment);
      setIsOpen(true);
    }
  }

  return (
    <div className="min-h-screen"
      style={{
        backgroundColor: '#ffffff', // Light theme background color
        color: '#171717', // Light theme text color
      }}>
      <div className="border-b">
        <div className="flex h-14 items-center gap-4 px-4">
          <Button variant="ghost" size="icon" onClick={()=>router.push('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <h1 className="text-lg font-semibold">My Assignments</h1>
          </div>
        </div>
      </div>

      <div className="py-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Input
              type="search"
              placeholder="Name"
              className="h-8 w-32"
            />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="w-full">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-[300px]">Name</TableHead>
                <TableHead className="w-[300px]">Location</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>From</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow className="cursor-pointer" key={assignment.id} onClick={()=> handleClick(assignment.id)}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getIcon('workflow',"h-4 w-4 text-blue-500")}
                      {assignment.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getIcon('unknown','h-6 w-6 text-gray-400')}
                      {assignment.location}
                    </div>
                  </TableCell>
                  <TableCell>{assignment.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-gray-700">
                      {assignment.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {assignment.status.toLocaleUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{assignment.from}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {isOpen && clickedAssignment &&  <ApproveWorkflow setIsOpen={setIsOpen} clickedAssignment={clickedAssignment}/>}
    </div>
  )
}