import * as React from "react"
import { Workflow, FileText, X } from 'lucide-react'
import { Button } from "@/components/ui/button";
import { useRecoilState, useSetRecoilState } from "recoil";
import { workflowState } from "@/lib/store/atoms/workflow";
import { assignmentState } from "@/lib/store/atoms/assignment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import axios from "axios"
import { BASE_URL } from "@/next.config"
import { toaster } from "@/pages/admin";
import { get } from "http";
import { getIcon } from "@/pages/icon/icon";

export function formatDate(date:Date) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight (0)
  return `${day}/${month}/${year} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}

interface File {
  id: string,
  name: string,
  type: string,
  items?: string,
  size?: string,
  modifiedAt: string | Date,
  isFavorite: boolean,
}

export default function StartWorkflow(
    {setIsOpen, 
      selectedWorkflow,
      setSelectedWorkflow, 
      setItems,
      items,
      selectedItems,
      setSelectedItems,
    }:
      {setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, 
       selectedWorkflow: string | undefined,
       setSelectedWorkflow: React.Dispatch<React.SetStateAction<string | undefined>>,
       setItems: React.Dispatch<React.SetStateAction<any[]>>,
       items: File[],
       selectedItems: string[],
       setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
      }
       
      
      ) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const setWorkflow = useSetRecoilState(workflowState);
  const setAssignments = useSetRecoilState(assignmentState);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files
    // Handle the dropped files here
    console.log(files)
  }

  

  const handleStartWorkflowClick = async () => {
    if(!selectedItems) return;

    const formattedDate = formatDate(new Date());
    for( const selectedItem of selectedItems){
      const type = items.filter((item) => item.id === selectedItem)[0].type;
      if(!type || type === "folder") {
        toaster("invalid file","",true);
        return;
      };
    }

    try{
      const res = await axios.post(`${BASE_URL}/api/v1/workflow`, {
        workflowName: "30079647 - "+selectedWorkflow + " WF Form - "+formattedDate,
        currentStep: selectedWorkflow + " WF Form - "+formattedDate,
        selectedFilesId: selectedItems,
        type: selectedWorkflow
      }, {
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      
      console.log("res.data :",res.data.workflow);
  
      const newWorkflow = {
        id: res.data.workflow.id,
        status: res.data.workflow.status,
        dueDate: res.data.workflow.dueDate,
        workflowName: res.data.workflow.workflowName,
        currentStep: res.data.workflow.currentStep,
        assignedTo: res.data.workflow.currentAssigneeUser.name,
        startDate: res.data.workflow.startDate,
        files: res.data.workflow.files,
        stopDate:res.data.workflow.stopDate
      }
      const assignments = {
        id:newWorkflow.id,
        name:newWorkflow.currentStep,
        location:newWorkflow.workflowName,
        dueDate:newWorkflow.dueDate,
        priority:"medium",
        status:newWorkflow.status,
        from:newWorkflow.assignedTo,
      }
      setWorkflow(prevWorkflows => ({
        ...prevWorkflows,
        items: [...prevWorkflows.items, newWorkflow]
      }));

      setAssignments(prevAssignments => ({
        ...prevAssignments,
        items: [...prevAssignments.items, assignments]
      }));

      setSelectedItems && setSelectedItems([]);

      toaster("created workflow",res.data.workflow.id,false);
    } catch (e) {
      toaster("create workflow",'',true);
    }
    
  }

  return (
    <>
      {true && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-[80vw] h-[80vh] flex flex-col">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Workflow className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Workflow</h2>
              </div>
              <Select onValueChange={setSelectedWorkflow} >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select workflow type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NFA" className="cursor-pointer">NFA workflow</SelectItem>
                  <SelectItem value="Letter" className="cursor-pointer">Letter workflow</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Main Content */}
            <div className="flex-grow flex">
              <div className="w-[70%] p-4 flex items-center justify-center">
                <p className="text-lg text-gray-600">
                  Select the workflow you want to initiate from the drop-down list.
                </p>
              </div>

              <Separator orientation="vertical" className="h-auto" />

              <div className="w-[30%] p-4 flex flex-col">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex-grow flex flex-col items-center justify-center cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <FileText className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-center text-gray-500">Drag and Drop files here</p>
                </div>
                {selectedItems.map((itemId, index) => {
                  const item = items.find(item => item.id === itemId);
                  return (
                  <div className="mt-1 p-2 bg-gray-100 rounded flex items-center">
                    {getIcon(item ? item.type : "","h-4 w-4 mr-2")}
                    <span className="text-xs">{item?.name}</span>
                </div>
                
                )})}
              </div>
            </div>

            <Separator />

            {/* Footer */}
            <div className="p-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={!selectedWorkflow}
                onClick={() => setIsDialogOpen(true)}
              >
                Start
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className=" bg-white text-black">
          <DialogHeader>
            <DialogTitle>Confirm Workflow Initiation</DialogTitle>
            <DialogDescription>
              Click OK to initiate the "{selectedWorkflow}" workflow. Do you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setIsDialogOpen(false)
              setIsOpen(false)
              // Here you would typically start the workflow
              console.log(`Starting ${selectedWorkflow} workflow`)
              handleStartWorkflowClick()
            }}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}