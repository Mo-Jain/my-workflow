import * as React from "react"
import { Workflow, FileText, X, ArrowBigRight, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react'
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
import { Textarea } from "./ui/textarea";
import { userState } from "@/lib/store/atoms/user";
import { useRouter } from "next/router";
import { Approver, ApproverField, InputSearchApprover } from "./SearchApprover";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

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
export function getCamelCaseLetters(name:string){
  const nameArr = name.split('.');
  nameArr.map(name => name = name.charAt(0).toUpperCase() + name.slice(1));
  return nameArr.join('');
}

interface ParentApprover {
  id:number,
  name:string,
  comment:string
}

export default function ApproveWorkflow(
    {setIsOpen,clickedAssignment}:
    {setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,clickedAssignment:Item}
 ) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const setAssignments = useSetRecoilState(assignmentState);
  const [action,setAction] = React.useState<"Approve" | "Reject" |"Forward" | "Send for review" | "Reply">("Approve");
  const [comments,setComments] = React.useState("");
  const router = useRouter();
  const [forward,setForward] = React.useState<Approver[]>([]);
  const [shortName,setShortName] = React.useState("");
  const [isMessageOpen,setIsMessageOpen] = React.useState(true);

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

  React.useEffect(() => {
    const name = clickedAssignment.currentApproval?.parentApprovalName;
    if(name){
      const nameArray = name.split(" ");
      const temp = ( nameArray[nameArray.length-1][0] + nameArray[0][0]).toUpperCase();
      setShortName(temp);
    }
  },[clickedAssignment.currentApproval?.parentApprovalName])

 
  const getLongdate = (date:Date | null | undefined) => {
    const possibleDate = new Date(date ? date: new Date());
    return possibleDate.toLocaleString('default', { month: 'long' })+ " "+possibleDate.getDate()+ ", " +possibleDate.getFullYear()
  }

  const handleAction = async() =>{
    try{
      let payload = {}
      if(action==="Forward" || action==="Send for review"){
        if(forward.length===0){
          toaster("please add user to forward","",true);
          return;
        }
        payload = {
          comments,
          userId:forward[0].id
        }
      }
      else{
        payload = {
          comments,
        }
      }
      setIsDialogOpen(false);
      const res = await axios.post(`${BASE_URL}/api/v1/assignment/${action.toLocaleLowerCase().replaceAll(' ','')}/${clickedAssignment.currentApproval?.approvalId}`,  payload,
        {
          headers: {
            "Content-Type": "application/json",
            authorization : `Bearer `+ localStorage.getItem('token')
          },
        })

        console.log(res.data);
      
        setAssignments(prevAssignments => ({
          ...prevAssignments,
          items: prevAssignments.items.filter(item => item.id !== clickedAssignment.id),
        }))

        toaster(action+"d workflow",clickedAssignment.id,false);
    }
    catch(e){ 
      console.log(e)
      toaster(action +" workflow",clickedAssignment.id,true);
    }
    setIsOpen(false);
  }

  const handleReview = async () => {

    
    try{
      setIsDialogOpen(false);
      const res = await axios.post(`${BASE_URL}/api/v1/assignment/reply/${clickedAssignment.currentApproval?.approvalId}`, { comments, id:clickedAssignment.currentApproval?.parentApprovalId },{
        headers: {
          "Content-Type": "application/json",
          authorization : `Bearer `+ localStorage.getItem('token')
        },
      })

      console.log(res.data);
      setAssignments(prevAssignments => ({
        ...prevAssignments,
        items: prevAssignments.items.filter(item => item.id !== clickedAssignment.id),
      }))

      toaster("replied workflow",clickedAssignment.id,false);
    }
    catch(e) {
      console.error(e);
      toaster("reply workflow",clickedAssignment.id,true);
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
                <h2 className="text-xl font-semibold">{clickedAssignment.name}</h2>
              </div>
              <div className="flex mb-0 font-semibold py-0 space-x-2 w-[20%]">
                Attachments
              </div>
            </div>
 
            <Separator />
            {/* Main Content */}
            <div className="flex-grow flex px-4">
              <div className="w-[70%] flex items-center flex-col px-2  justify-between">
                {clickedAssignment.currentApproval?.parentApprovalId && clickedAssignment.currentApproval?.parentApprovalComments &&
                <div className="w-full h-fit whitespace-nowrap border-t-4 border-green-400 px-4 py-1 bg-gray-200 text-base text-black flex flex-col gap-2 ">
                  <div>
                    <div className="p-0 m-0 flex justify-between my-1">
                      <div>
                        <span>
                            Message from <span className="font-bold w-fit p-0 m-0">{clickedAssignment.currentApproval?.parentApprovalName}</span>
                        </span>
                      </div>
                        {isMessageOpen ?
                        <ChevronUp className="h-4 w-4  cursor-pointer" onClick={() => setIsMessageOpen(!isMessageOpen)} />
                        :
                        <ChevronDown className="h-4 w-4  cursor-pointer" onClick={() => setIsMessageOpen(!isMessageOpen)} />
                        }
                    </div>
                    <div className={`${isMessageOpen ? "max-h-[120px]" : "max-h-[0px] overflow-hidden"} transition-all` }>
                      {clickedAssignment.currentApproval?.parentApprovalStatus === "Sent for review" ?
                        <div className="p-0 mb-2">who sent you a workflow step for review. Please add a comment and reply</div>
                        :
                        <div className="p-0 mb-2 display-inline">who forwarded you a workflow step.</div>
                      }
                      <span className="text-sm">{clickedAssignment.currentApproval?.parentApprovalComments.split('\n')[1]}</span>
                    </div>
                  </div>
                </div>}
                <div></div>
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
                    <div className="mb-4 text-blue-500 cursor-pointer" onClick={() => router.push('/nrdms/report/'+clickedAssignment.id)}>Click here to Open Workflow Report</div>
                  </div>
                </div>
                <div></div>
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
                {clickedAssignment.currentApproval?.parentApprovalStatus !== "Sent for review" && 
                <Button variant="outline"
                  onClick={() => {
                    setIsDialogOpen(true)
                    setAction("Send for review")
                  }}
                  >
                      Send for Review
                </Button>}
                <div/>
                <div className="flex space-x-2">
                {clickedAssignment.currentApproval?.parentApprovalStatus === "Sent for review" ?
                  <>
                    <Button onClick={() => {
                      setAction("Reply")
                      setIsDialogOpen(true);
                    }}>
                        Reply
                    </Button>
                  </>
                  :
                  <>
                    <Button variant="outline"
                      onClick={() => {
                        setIsDialogOpen(true)
                        setAction("Forward")
                      }}
                      >
                        Forward
                    </Button>
                    <Button
                        onClick={() => {
                          setIsDialogOpen(true)
                          setAction("Approve")
                        }}
                    >
                        Approve
                    </Button>
                    <Button  onClick={() => {
                      setIsDialogOpen(true)
                      setAction("Reject")
                    }}>
                        Reject
                    </Button>
                  </>
                    }
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
            <DialogTitle>{action+ ": " + clickedAssignment.name}  </DialogTitle>
          </DialogHeader>
          <DialogDescription className="py-2">
            { (action ==="Forward" || action === "Send for review") &&
            <div>
              <span className="text-red-500">*</span>{action === "Send for review" ? "Send To" : "Forward To"}
              <InputSearchApprover
                approvers={forward}
                setApprovers={setForward}
                className={`w-1/2 h-6 mt-1 text-xs border border-gray-800`}
                finalApproval={true}
              />
              <ApproverField
                approvers={forward}
                setApprovers={setForward}
                className={`w-1/2 h-6 mt-3 text-xs border border-gray-800`}
              />
          </div>
            }
            {action === "Reply" &&
              <div className=" gap-2">
                <div className="text-black px-2">To</div>
                <div className="text-black font-semibold px-2 mb-2 flex"></div>
                  <Avatar className="h-8 w-8 bg-blue-900 text-white p-1 rounded-full m-2">
                    <AvatarFallback className='bg-blue-900'>{shortName}</AvatarFallback>
                  </Avatar>
                  <span>{clickedAssignment.currentApproval?.parentApprovalName}</span>
              </div>
            }
            <div>
              <div className="text-black p-2">Add Comments</div>
              <Textarea value={comments} placeholder="Add message" className="h-24 border-2 border-gray-500" onChange={(e) => setComments(e.target.value)} />
            </div> 
            
          </DialogDescription>
          <DialogFooter className="border-t border-gray-200 py-2">
            {action !== "Reply" ? 
              <Button onClick={() => handleAction()}>
                Submit
              </Button>
              :
              <Button onClick={() => handleReview()}>
                Reply
              </Button>
            }
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
           
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}