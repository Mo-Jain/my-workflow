import MyWorkflow from "@/components/MyWorkflow"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Folder, Clock, Star, Workflow, CheckCircle2 } from "lucide-react"
import { useRouter } from 'next/router'
import { useState } from "react"


export default function Home() {
  const [workflowVisible, setWorkflowVisible] = useState(false);
  
  const router = useRouter();

  return (
    <>
    {/* Workflow Popup */}
    {workflowVisible && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          {/* Translucent overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50 z-30"
          />
          
          {/* Popup content */}
          <div className="relative z-40 bg-white rounded-lg shadow-lg w-max h-[85vh] overflow-y-auto  ">
            <MyWorkflow onClose={()=>setWorkflowVisible(false)}/>
          </div>
        </div>
      )}
    <div className="min-h-screen bg-gray-300">
      {/* Existing Dashboard Content */}
      <div className="px-8 py-1">
        <div className="grid grid-cols-4 grid-rows-4 gap-3 h-[calc(100vh)]">
          <Card className="col-span-2 row-span-2 rounded-none">
            <CardHeader className="flex flex-row items-center gap-2 border-b h-1/6 cursor-pointer hover:bg-gray-100">
              <FileText className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-sm font-medium">Documents and Versions Uploaded</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)] flex items-center justify-center text-muted-foreground">
              No documents to display
            </CardContent>
          </Card>
          
          <Card className="row-span-2 rounded-none">
            <CardHeader 
              className="flex flex-row items-center gap-2 border-b h-1/6 cursor-pointer hover:bg-gray-100"
              onClick={()=>router.push('/myassignment')} >
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <CardTitle className="text-sm font-medium">My Assignments</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)] flex items-center">
              <div className="flex items-start gap-2 text-sm">
                <FileText className="h-4 w-4 shrink-0" />
                <div>
                  <div>NFA Form - 10/Sep/2024 03:16 PM</div>
                  <div className="text-xs text-muted-foreground">30079647 - NFA WF - 10/Sep/2024 03:16...</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="row-span-2 rounded-none">
            <CardHeader 
              className="flex flex-row items-center gap-2 border-b h-1/6 cursor-pointer hover:bg-gray-100"
              onClick={()=>setWorkflowVisible(true)}>
              <Workflow className="h-5 w-5 text-green-500" />
              <CardTitle className="text-sm font-medium">My Workflows</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)] bg-gray-800 text-white flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">1</span>
                  <span className="text-gray-300">Total</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-gray-300">On time</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <div className="text-gray-400 text-xs">Workflow name</div>
                  <div className="text-sm">30079647 - NFA WF - 10/Sep/2024 03:16 PM</div>
                </div>
                
                <div>
                  <div className="text-gray-400 text-xs">Current step</div>
                  <div className="text-sm">NFA Form - 10/Sep/2024 03:16 PM</div>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <div className="text-gray-400 text-xs">Assigned to</div>
                    <div className="text-sm">Mohit Jain</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs">Start date</div>
                    <div className="text-sm">September 10, 2024</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="row-span-2 rounded-none">
              <CardHeader className="flex flex-row items-center gap-2 border-b h-1/6 cursor-pointer hover:bg-gray-100" 
                          onClick={()=>router.push('/favorites')}>
                <Star className="h-5 w-5 text-yellow-500" />
                  <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              </CardHeader>
            <CardContent className="h-[calc(100%-4rem)] flex flex-col items-center justify-center text-muted-foreground">
              <FileText className="h-12 w-12 text-gray-200 mb-2" />
              There are no items to display.
            </CardContent>
          </Card>
          
          <Card className="row-span-2 rounded-none">
            <CardHeader className="flex flex-row items-center gap-2 border-b h-1/6 cursor-pointer hover:bg-gray-100" 
                          onClick={()=>router.push('/recentlyaccessed')}>              
              <Clock className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-sm font-medium">Recently Accessed</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)] flex items-center">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-red-500" />
                ANR - PROD - ECM - UG - NFA & Letters Workflow
              </div>
            </CardContent>
          </Card>

          <Button variant="ghost" 
                  className="bg-purple-900 hover:bg-purple-950 text-white flex flex-col items-center justify-center gap-2 h-full rounded-none"
                  onClick={()=>router.push('/enterprise')}>
            <Folder className="h-6 w-6" />
            <span className="text-xs text-center">Enterprise</span>
          </Button>
          
          <Button variant="ghost" 
                  className="bg-purple-900 hover:bg-purple-950 text-white flex flex-col items-center justify-center gap-2 h-full rounded-none"
                  onClick={()=>router.push('/personalworkspace')}>
            <Folder className="h-6 w-6" />
            <span className="text-xs text-center">Personal Workspace</span>
          </Button>
          
          <Button variant="ghost" 
                  className="bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center gap-2 h-full rounded-none"
                  onClick={()=>router.push('/userguide')}>
            <Folder className="h-6 w-6" />
            <span className="text-xs text-center">User Guides</span>
          </Button>
          
          <Button variant="ghost" 
                  className="bg-blue-800 hover:bg-blue-900 text-white flex flex-col items-center justify-center gap-2 h-full rounded-none"
                  onClick={()=>router.push('/nfareport')}>
            <Folder className="h-6 w-6" />
            <span className="text-xs text-center">NFA and Letters Workflow Report</span>
          </Button>
        </div>
      </div>
    </div>
    
    </>
  )
}