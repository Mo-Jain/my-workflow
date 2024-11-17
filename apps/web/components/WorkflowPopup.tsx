import * as React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Circle, ArrowBigRightDashIcon, Clock, Clock1, Clock8, ChevronDown, ExternalLink } from 'lucide-react'
import { getIcon } from "@/pages/icon/icon"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { userNameState } from "@/lib/store/selectors/user"
import { toaster } from "@/pages/admin"
import axios from "axios"
import { BASE_URL } from "@/next.config"
import { assignmentState } from "@/lib/store/atoms/assignment"
import { workflowState } from "@/lib/store/atoms/workflow"
import { on } from "events"
import { workflowItems } from "@/lib/store/selectors/workflow"

interface Item {
  id: string,
  status: string,
  dueDate: Date,
  type: string,
  workflowName: string,
  currentStep: string,
  assignedTo: string,
  startDate: Date,
  files: File[]
}

interface File {
  id: string;
  name: string;
  path: string;
  type: string;
  creatorId: string;
  size: string;
  parentFolderId: string | null;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  workflowId: string | null;
}

export default function WorkflowPopup(
  {onClose,clickedItem,setClickedItem}:
  {
    onClose:()=>void,
    clickedItem:Item | undefined,
    setClickedItem:React.Dispatch<React.SetStateAction<Item | undefined>>
  }
) {
  console.log(clickedItem);
  const userName  =  useRecoilValue(userNameState);
  const [shortName,setShortName] = React.useState("");
  const setWorkflow = useSetRecoilState(workflowState);
  const setAssignments = useSetRecoilState(assignmentState);
  const workflows = useRecoilValue(workflowItems);


  React.useEffect(() => {
    const name = userName;
    if(name){
      const nameArray = name.split(" ");
      const temp = ( nameArray[nameArray.length-1][0] + nameArray[0][0]).toUpperCase();
      setShortName(temp);
    }
  },[userName])

  const handleStopWorkflow = async () => {
    try{
      const res = await axios.put(`${BASE_URL}/api/v1/workflow/${clickedItem?.id}`, {
        status: "stopped"
      }, {
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      toaster("workflow stopped",res.data.id,false);
      
      setWorkflow(prevWorkflows => ({
        ...prevWorkflows,
        items: prevWorkflows.items.map(item => item.id === res.data.id ? { ...item, status: "stopped" } : item)
      }));

      setAssignments(prevAssignments => ({
        ...prevAssignments,
        items: prevAssignments.items.map(item => item.id === res.data.id ? { ...item, status: "stopped" } : item)
      }));

      
      setClickedItem( prev => {
        return (
          prev && { ...prev, status: "stopped" }
        )});
        
      console.log(workflows);
      
    }catch(e){
      toaster("stop",'',true);
    }
  }

  const handleDeleteWorkflow = async () => {
    try{
      const res = await axios.delete(`${BASE_URL}/api/v1/workflow/${clickedItem?.id}`, {
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      toaster("workflow deleted",res.data.id,false);

      setAssignments(prevAssignments => ({
        ...prevAssignments,
        items: prevAssignments.items.filter(item => item.id !== res.data.id)
      }));

      setWorkflow(prevWorkflows => ({
        ...prevWorkflows,
        items: prevWorkflows.items.filter(item => item.id !== res.data.id)
      }));

      setClickedItem(undefined);

      onClose();
    }catch(e){
      toaster("delete",'',true);
    }
  }

  return (
    <div className="min-h-screen bg-white w-[75vw] py-2 px-4 overflow-y-hidden text-xs">
       <div className="flex items-center justify-between ">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium">Workflow</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-[1fr,300px] gap-4 items-center">
          {/* Timeline and Current Step */}
          <div className="space-y-6">
            <div className="relative pl-8">
              <div className="absolute left-3 top-0 bottom-0 w-[3px] bg-gray-500" />
              
              {/* Timeline Points */}
              <div className="space-y-8">
                <div className="relative">
                  <div className="absolute -left-[28px] bg-white h-6" >
                    <Circle className="h-4 w-4 text-gray-400 fill-gray-400" />
                  </div>
                  <div className="text-sm text-gray-500">End</div>
                </div>

                {clickedItem?.status !== "stopped" && <div className="relative">
                  <div className="absolute -left-[28px] bg-white h-6 flex items-center">
                     <Clock8 className={`h-4 w-4 text-blue-800 fill-blue-300`} />
                  </div>
                  <div className="text-sm text-gray-500">Next Step</div>
                </div>}

                <div className="relative flex items-center justify-center">
                  <div className="absolute -left-[46px]  h-14 w-14 rounded-full flex items-center justify-center bg-white ">
                    {getIcon(clickedItem ? clickedItem.status : "","h-10 w-10")}
                  </div>

                  <ArrowBigRightDashIcon className={`absolute -left-[4px] z-10 h-20 w-20 ${clickedItem?.status!=="stopped"? "text-blue-500 fill-blue-500":"text-red-500 fill-red-500"} m-0`} />
                  <Card className={`relative -left-[7vw] rounded-none border-l-4 ${clickedItem?.status!=="stopped"? "border-l-blue-500":"border-l-red-500"}`}>
                    <CardContent className="p-4">
                      <div className={`mb-1 font-medium ${clickedItem?.status!=="stopped"? "text-blue-600":"text-red-600"}`}>Current Step</div>
                      <div className="flex items-center justify-between">
                        <div className="flex  gap-2">
                          {getIcon(clickedItem ? clickedItem.status : "","h-5 w-5 text-blue-500")}
                          <div className="max-w-[200px]">
                            <div className="font-medium overflow-hidden text-ellipsis whitespace-nowrap">{clickedItem?.currentStep}</div>
                            <div className="text-sm text-muted-foreground">{clickedItem?.assignedTo}</div>
                          </div>
                        </div>
                        <Badge variant="secondary" className={` ${clickedItem?.status === "on time" ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-700"}`}>
                          {clickedItem?.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="relative">
                  <div className="absolute -left-[28px] bg-white h-6 flex items-center" >
                    {getIcon('check',"h-4 w-4 text-green-500")}
                  </div>
                  <div className="text-sm text-gray-500">Completed Step</div>
                </div>

                <div className="relative">
                    <div className="absolute -left-[28px] bg-white h-6 flex items-center" >
                        <Circle className="h-4 w-4 text-gray-400 fill-gray-400" />
                      </div>
                  <div className="text-sm text-gray-500">Start</div>
                </div>
              </div>
            </div>
          </div>

          {/* Details and Attachments Tabs */}
          <div className="bg-gray-200 p-4 ">
            <Tabs defaultValue="details" className="w-full ">
              <TabsList className="grid w-full grid-cols-2 ">
                <TabsTrigger  value="details">Details</TabsTrigger>
                <TabsTrigger value="attachments">
                  Attachments
                  <Badge variant="secondary" className="ml-2 bg-gray-100">
                    {clickedItem?.files?.length === 0 ? "" : clickedItem?.files?.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-4">
                <div className="space-y-4 text-black">
                  <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="font-medium overflow-hidden text-ellipsis whitespace-nowrap">{clickedItem?.workflowName}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Workflow Due date</div>
                    <div className="font-medium">-</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="font-medium">{clickedItem?.status}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Initiator</div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-blue-900 text-white text-xs">
                          {shortName}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{clickedItem?.assignedTo}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Started</div>
                    
                    <div className="font-medium">{new Date(clickedItem ? clickedItem.startDate : new Date()).toLocaleString('default', { month: 'long' })+ " "+new Date(clickedItem ? clickedItem.startDate : new Date()).getDate()+ ", " +new Date(clickedItem ? clickedItem.startDate : new Date()).getFullYear()}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 ">Workflow-ID</div>
                    <div className="font-medium overflow-hidden text-ellipsis whitespace-nowrap">{clickedItem?.id}</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="attachments" className="mt-4 min-h-[calc(100vh-291px)]">  
                {clickedItem?.files && clickedItem?.files.map(file =>{
                  console.log(file);
                  return(
                  <div className="flex items-center text-black gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                    {getIcon(file.type,"h-5 w-5 text-red-500")}
                  <span className="text-xs ">{file.name}</span>
                </div>
                )})}
              </TabsContent>
            </Tabs>

            {clickedItem?.status === "on time" ? <div className="mt-4">  
              <Button className="w-full bg-blue-900 hover:bg-blue-800" onClick={handleStopWorkflow}>
                Stop
              </Button>
            </div>
          :  
            <Button className="w-full bg-red-900 hover:bg-blue-800" onClick={handleDeleteWorkflow}>
                Delete
            </Button>
          }
          </div>
        </div>
      </div>
    </div>
  )
}