import MyWorkflow from "@/components/MyWorkflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { favoriteItems } from "@/lib/store/selectors/favoritesSelectors"
import { CheckCircle2Icon, Clock, FileText, Folder, Star } from "lucide-react"
import { useRouter } from 'next/router'
import {  useState } from "react"
import { useRecoilValue } from "recoil"
import { getIcon } from "./icon/icon"

import { recentlyViewedItems } from "@/lib/store/selectors/recentlyViewedSelectors"
import { workflowItems } from "@/lib/store/selectors/workflow"
import { assignmentItems } from "@/lib/store/selectors/assignment"
import FavoriteIcon from "@/components/FavoriteIcon"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Cardsworkflow from "@/components/Cardsworkflow"
import ApproveWorkflow from "@/components/ApproveWorkflow"
import { Item } from "@/lib/store/atoms/assignment"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function Home() {
  const [workflowVisible, setWorkflowVisible] = useState(false);
  const favorites = useRecoilValue(favoriteItems);
  const router = useRouter();
  const recentlyViewed = useRecoilValue(recentlyViewedItems);
  const workflows = useRecoilValue(workflowItems);
  const assignments = useRecoilValue(assignmentItems); 
  const [isOpen, setIsOpen] = useState(false);  
  const [clickedAssignment, setClickedAssignment] = useState<Item>();


  function handleClick(id: string) {
    const assignment = assignments.filter(assignment => assignment.id == id)[0];
    if(!assignment) return;
    if(assignment.name.includes("Form")){
      router.push(`/nrdms/form/${id}`);
    }
    else{
      console.log("id :",id);
      console.log("workflows :",workflows);
      console.log("assignments :",assignments);
      setClickedAssignment(assignment);
      setIsOpen(true);
    }
  }
  

  function handleDoubleClick(id:string,type:string) {
    if(type == "folder"){
      router.push(`/node/${id}`)
    }
  }


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

      {/* ------------------------------------------------------------------------------- */}
      {/* Documents and Versions Uploaded */}
      <div className="px-8 py-1">
        <div className="grid grid-cols-4 grid-rows-4 gap-3 h-[calc(100vh)]">
          <Card className="col-span-2 row-span-2 rounded-none">
            <CardHeader className="flex flex-row items-center gap-2 border-b h-1/6 cursor-pointer hover:bg-gray-100">
              {getIcon('docx',"h-5 w-5 text-blue-500")}
              <CardTitle className="text-sm font-medium">Documents and Versions Uploaded</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-3rem)] bg-gray-100 flex items-center justify-center text-muted-foreground">
              No documents to display
            </CardContent>
          </Card>
          
          {/* ------------------------------------------------------------------------------- */}
          {/* My Assignments */}
          <Card className="row-span-2 rounded-none overflow-hidden">
            <CardHeader 
              className="flex flex-row items-center gap-2 border-b h-1/6 cursor-pointer hover:bg-gray-100"
              onClick={()=>router.push('/myassignment')} >
              {getIcon('check',"h-8 w-8 text-white fill-green-500 stroke-2")}
              <CardTitle className="text-sm  font-medium">My Assignments</CardTitle>
            </CardHeader>
            {assignments.length > 0 ?
              <CardContent className="h-[calc(100%-3rem)] bg-gray-100 flex flex-col items-center px-0 text-muted-foreground">
              {assignments.map((item) =>(
                <div className="flex items-start w-full cursor-pointer items-center gap-2 text-sm py-1 px-1" onClick={() => handleClick(item.id)}>
                  {getIcon('workflow',"h-6 w-6 fill-green-400 shrink-0 ")}
                  <div className="border-b">
                    <div className="text-black max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.name}
                    </div>
                    <div className="text-xs max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap py-1">
                        {item.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                  </div>
                </div>
              ))}
              </CardContent>
              :
              <>
                
                <CardContent className="h-[calc(100%-3rem)] flex flex-col items-center justify-center text-muted-foreground">
                  <CheckCircle2Icon className="h-16 w-16 text-gray-200 mb-2" />
                  <span className="text-center">There are no assignments assigned to you.</span>
                </CardContent>
              </>
              }
          </Card>

          {/* ------------------------------------------------------------------------------- */}
          {/* My Workflows */}
          <Cardsworkflow setWorkflowVisible={setWorkflowVisible}/>

          {/* ------------------------------------------------------------------------------- */}
          {/* Favorites */}
          <Card className="row-span-2 rounded-none overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-2 border-b h-1/6 cursor-pointer hover:bg-gray-100" 
                          onClick={()=>router.push('/favorites')}>
                {getIcon('star',"h-5 w-5 text-yellow-500 stroke-2")}
                  <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              </CardHeader>
              {favorites.length > 0 ? 
              <CardContent className="h-[calc(100%-3rem)] bg-gray-100 flex flex-col items-center px-0 text-muted-foreground">
                {favorites.map(item => (
                  <div 
                    key={item.id}
                    onDoubleClick={() => handleDoubleClick(item.id,item.type)}
                    className="flex justify-between cursor-pointer border gap-2 w-full text-black p-1 px-2 bg-grey-100" >
                      <div className="flex gap-2 items-center">
                        {getIcon(item.type,"h-5")}
                        <span className="text-sm text-black max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">{item.name}</span>
                      </div>
                      <FavoriteIcon item={item} items={favorites}/>
                  </div>
                ))}
              </CardContent>
              :
              <>
                
                <CardContent className="h-[calc(100%-3rem)] flex flex-col items-center justify-center text-muted-foreground">
                  <Star className="h-16 w-16 text-gray-200 mb-2" />
                  <span className="text-center">There are no items to display as favorites.</span>
                </CardContent>
              </>
              }
          </Card>

          {/* ------------------------------------------------------------------------------- */}
          {/* Recently Accessed */}
          <Card className="row-span-2 rounded-none overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-2 border-b h-1/6 cursor-pointer hover:bg-gray-100" 
                          onClick={()=>router.push('/recentlyaccessed')}>              
              {getIcon('clock',"h-8 w-8 stroke-1 text-white fill-gray-400")}
              <CardTitle className="text-sm font-medium">Recently Accessed</CardTitle>
            </CardHeader>
            {recentlyViewed.length > 0 ?
              <CardContent className="h-[calc(100%-3rem)] bg-gray-100 flex flex-col items-center px-0 text-muted-foreground">
              {recentlyViewed.map((item:any)=>(
                    <div 
                      key={item.id}
                      className="flex justify-between cursor-pointer gap-2 w-full text-black py-2 px-2 border bg-grey-100 hover:bg-gray-100" >
                        <div className="flex gap-2 items-center">
                          {getIcon(item.type,"h-6 w-6")}
                          <span className="text-sm text-black max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap">{item.name}</span>
                        </div>
                        
                    </div>
                  ))}
              </CardContent>
              :
              <>
                <CardContent className="h-[calc(100%-3rem)] flex flex-col items-center justify-center text-muted-foreground">
                  <Clock className="h-16 w-16 text-gray-200 mb-2" />
                  There are no items to display.
                </CardContent>
              </>
            }
          </Card>

          {/* ------------------------------------------------------------------------------- */}
          {/* Enterprise */}
          <div className="bg-stone-700 cursor-pointer hover:bg-stone-800 hover:text-white text-white flex flex-col items-center justify-center"
                  onClick={()=>router.push('/enterprise')}>
            <Folder className="h-12 w-12 p-2 fill-white stroke-0" />
            <span className="text-sm text-center">Enterprise Folder</span>
          </div>

          {/* ------------------------------------------------------------------------------- */}          
          {/* Personal Workspace */}
          <div className="bg-zinc-700 cursor-pointer hover:bg-zinc-800 hover:text-white text-white flex flex-col items-center justify-center"
                  onClick={()=>router.push('/personalworkspace ')}>
            <Folder className="h-12 w-12 p-2 fill-white stroke-0" />
            <span className="text-sm text-center">Personal Workspace</span>
          </div>

          {/* ------------------------------------------------------------------------------- */}          
          {/* User Guides */}
          <div className="bg-blue-700 cursor-pointer hover:bg-blue-800 hover:text-white text-white flex flex-col items-center justify-center"
                  onClick={()=>router.push('/userguide')}>
            <Folder className="h-12 w-12 p-2 fill-white stroke-0" />
            <span className="text-sm text-center">User Guides</span>
          </div>

          {/* ------------------------------------------------------------------------------- */}          
          {/* NFA and Letters Workflow Report */}
          <div className="bg-purple-900 cursor-pointer hover:bg-purple-950 hover:text-white text-white flex flex-col items-center justify-center"
                  onClick={()=>router.push('/nrdms/report/page')}>
            <Folder className="h-12 w-12 p-2 fill-white stroke-0" />
            <span className="text-sm text-center">NFA and Letters Workflow Report</span>
          </div>
          
        </div>
      </div>
      {isOpen && clickedAssignment  && <ApproveWorkflow setIsOpen={setIsOpen} clickedAssignment={clickedAssignment}/>}
    </div>
    
    </>
  )
}