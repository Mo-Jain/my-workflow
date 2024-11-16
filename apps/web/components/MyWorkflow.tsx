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
import FileManager from "./FileManger"
import { useState } from "react"
import { getIcon } from "@/pages/icon/icon"
import { useRouter } from "next/navigation"
import { workflowItems } from "@/lib/store/selectors/workflow"
import { useRecoilValue } from "recoil"

// Sample data - in a real app this would come from your backend
const workflowsListnotused = [
  {
    id: "1",
    status: "on time",
    durDate: "",
    type: "dot",
    workflow: "30079647 - NFA WF - 10/Sep/2024 03:16",
    currentstep: "NFA Form - 10/Sep/2024 03:16 PM",
    assignedto: "Mohit Jain",
    startdate: "September 10, 2024"
  },
  {
    id: "2",
    status: "on time",
    durDate: "",
    type: "dot",
    workflow: "30079647 - NFA WF - 04/Nov/2024 03:53",
    currentstep: "NFA Form - 04/Nov/2024 03:53 PM",
    assignedto: "Mohit Jain",
    startdate: "November 4, 2024"
  }
]


interface Workflow {
  id: string;
  status: string;
  durDate: string;
  type: string
  workflow: string;
  currentstep: string;
  assignedto: string;
  startdate: string;
}

export default function Component(
  {onClose}:
  {onClose:()=>void}
) {
  const [workflowsList, setWorkflowsList] = useState<Workflow[]>([]);
  const router = useRouter();
  const workflows = useRecoilValue(workflowItems);
  
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

        <FileManager
          headers={["Status","Step Due Date","Workflow","CurrentStep","AssignedTo","StartDate"]}
          items={workflows.map((workflow:any) => ({...workflow,type:workflow.status}))}
          setItems={setWorkflowsList}
          hasFavorite={false}
          iconStyle="h-4 w-4"
        />
      </div>
    </div>
  )
}


///                      
