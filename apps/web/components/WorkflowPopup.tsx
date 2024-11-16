import * as React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Circle, ArrowBigRightDashIcon, Clock, Clock1, Clock8, ChevronDown, ExternalLink } from 'lucide-react'
import { getIcon } from "@/pages/icon/icon"
import { useRecoilValue } from "recoil"
import { userNameState } from "@/lib/store/selectors/user"

interface Item {
  id: string,
  status: string,
  durDate: Date,
  type: string,
  workflowName: string,
  currentStep: string,
  assignedTo: string,
  startDate: Date
}

export default function WorkflowPopup(
  {onClose,clickedItem}:
  {onClose:()=>void,clickedItem:Item | undefined}
) {
  console.log(clickedItem);
  const userName  =  useRecoilValue(userNameState);
  const [shortName,setShortName] = React.useState("")


  React.useEffect(() => {
    const name = userName;
    if(name){
      const nameArray = name.split(" ");
      const temp = ( nameArray[nameArray.length-1][0] + nameArray[0][0]).toUpperCase();
      setShortName(temp);
    }
  },[userName])
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

                <div className="relative">
                  <div className="absolute -left-[28px] bg-white h-6 flex items-center">
                     <Clock8 className={`h-4 w-4 text-blue-800 fill-blue-300`} />
                  </div>
                  <div className="text-sm text-gray-500">Next Step</div>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="absolute -left-[44px] bg-white h-12 w-12 rounded-full flex items-center justify-center bg-white">
                    {getIcon(clickedItem ? clickedItem.status : "","h-10 w-10 bg-white")}
                  </div>

                  <ArrowBigRightDashIcon className="absolute -left-[4px] z-10 h-20 w-20 text-blue-500 m-0" />
                  <Card className="relative -left-[7vw] rounded-none border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="mb-1 font-medium text-blue-600">Current Step</div>
                      <div className="flex items-center justify-between">
                        <div className="flex  gap-2">
                          {getIcon(clickedItem ? clickedItem.status : "","h-5 w-5 text-blue-500")}
                          <div className="max-w-[200px]">
                            <div className="font-medium overflow-hidden text-ellipsis whitespace-nowrap">{clickedItem?.currentStep}</div>
                            <div className="text-sm text-muted-foreground">{clickedItem?.assignedTo}</div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
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
                    1
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
                <div className="flex items-center text-black gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <FileText className="h-5 w-5 text-red-500" />
                  <span className="text-xs ">NFA for china visit approval.pdf</span>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4">
              <Button className="w-full bg-blue-900 hover:bg-blue-800">
                Stop
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}