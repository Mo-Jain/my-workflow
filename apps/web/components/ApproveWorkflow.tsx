import * as React from "react"
import { Workflow, FileText, X } from 'lucide-react'
import { Button } from "@/components/ui/button";
import {  useRecoilValue, useSetRecoilState } from "recoil";
import { workflowState } from "@/lib/store/atoms/workflow";
import { assignmentState, Item } from "@/lib/store/atoms/assignment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Separator } from "@/components/ui/separator"

import { getIcon } from "@/pages/icon/icon";
import { BASE_URL } from "@/next.config";
import axios from "axios";
import { toaster } from "@/pages/admin";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { userState } from "@/lib/store/atoms/user";

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


export default function ApproveWorkflow(
    {setIsOpen,clickedAssignment}:
    {setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,clickedAssignment:Item}
 ) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const setWorkflow = useSetRecoilState(workflowState);
  const setAssignments = useSetRecoilState(assignmentState);
  const [action,setAction] = React.useState<"approve"|"reject">("approve");
  const [comments,setComments] = React.useState("");
  const user = useRecoilValue(userState);

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
  const getLongdate = (date:Date | null | undefined) => {
    const possibleDate = new Date(date ? date: new Date());
    return possibleDate.toLocaleString('default', { month: 'long' })+ " "+possibleDate.getDate()+ ", " +possibleDate.getFullYear()
  }

  const handleAction = async() =>{
    try{
      const res = await axios.post(`${BASE_URL}/api/v1/assignment/${action}/${clickedAssignment.id}`,  {comments:comments,userId:user.userId},
        {
          headers: {
            "Content-Type": "application/json",
          },
        })

        console.log(res.data);
      
        setAssignments(prevAssignments => ({
          ...prevAssignments,
          items: prevAssignments.items.filter(item => item.id !== clickedAssignment.id),
        }))

        toaster("approved workflow",clickedAssignment.id,false);
    }
    catch(e){
      console.log(e)
      toaster("approve workflow",clickedAssignment.id,true);
    }
    setIsOpen(false);
  }
 


  return (
    <>
      {true && (
        <div className="fixed inset-0 z-20 text-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-[80vw] h-[80vh] flex flex-col">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Workflow className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Flexi-Flow Approval</h2>
              </div>
              <div className="flex mb-0 font-semibold py-0 space-x-2 w-[20%]">
                Attachments
              </div>
            </div>

            <Separator />

            {/* Main Content */}
            <div className="flex-grow flex">
              <div className="w-[70%] p-4 flex items-center justify-center">
                <div className="text-sm text-gray-600 grid grid-cols-2 gap-x-4 gap-y-8">
                  <div className="col-span-1 w-fit justify-self-end">
                    <div className="mb-4 text-right">Workflow Title</div>
                    <div className="mb-4 text-right">Initiator</div>
                    <div className="mb-4 text-right">Initiated Date</div>
                    <div className="mb-4 text-right">Download All Attachments</div>
                    <div className="mb-4 text-right">Workflow Report</div>
                  </div>
                  <div className=" col-span-1 w-fit">
                    <div className="mb-4">{clickedAssignment.location}</div>
                    <div className="mb-4">{clickedAssignment.from}</div>
                    <div className="mb-4">{getLongdate(clickedAssignment.startDate)}</div>
                    <div className="mb-4 text-blue-500 cursor-pointer">Click here to Download All Attachments</div>
                    <div className="mb-4 text-blue-500 cursor-pointer">Click here to Open Workflow Report</div>
                  </div>
                </div>
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
                <div className="mt-1 p-2 bg-gray-100 rounded flex items-center">
                    {getIcon("pdf","h-4 w-4 mr-2")}
                    <span className="text-xs">Test.pdf</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Footer */}
            <div className="p-4 flex justify-between space-x-2">
                    <Button variant="outline">
                        Send for Review
                    </Button>
                <div className="flex space-x-2">
                    <Button variant="outline">
                        Forward
                    </Button>
                    <Button
                        onClick={() => {
                          setIsDialogOpen(true)
                          setAction("approve")
                        }}
                    >
                        Approve
                    </Button>
                    <Button  onClick={() => {
                      setIsDialogOpen(true)
                      setAction("reject")
                    }}>
                        Reject
                    </Button>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className=" bg-white text-black p-2">
          <DialogHeader className="border-b border-gray-200 py-2">
            <DialogTitle>{action=="approve" ? "Approve Workflow" : "Reject Workflow"}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="py-2">
            {action=="approve" ? 
            <div>
              <div className="text-black p-2">Add Comments</div>
              <Textarea value={comments} placeholder="Add message" className="h-24 border-2 border-gray-500" onChange={(e) => setComments(e.target.value)} />
            </div> 
            :
              "Click OK to reject the workflow. Do you want to continue?"}
          </DialogDescription>
          <DialogFooter className="border-t border-gray-200 py-2">
          <Button onClick={() => {
              setIsDialogOpen(false)
              // Here you would typically start the workflow
              handleAction();
            }}>
              {action == "approve" ? "Submit" : "Ok"}
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
           
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}