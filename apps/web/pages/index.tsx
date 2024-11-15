import MyWorkflow from "@/components/MyWorkflow"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { favoriteItems } from "@/lib/store/selectors/favoritesSelectors"
import { get } from "http"
import { FileText, Folder, Clock, Star, Workflow, CheckCircle2 } from "lucide-react"
import { useRouter } from 'next/router'
import { useEffect, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { getFileIcon } from "./icon/icon"
import { favoritesState } from "@/lib/store/atoms/favorites"
import { BASE_URL } from "@/next.config"
import axios from "axios"
import { recentlyViewedItems } from "@/lib/store/selectors/recentlyViewedSelectors"
import { workflowItems } from "@/lib/store/selectors/workflow"
import { assignmentItems } from "@/lib/store/selectors/assignment"


export default function Home() {
  const [workflowVisible, setWorkflowVisible] = useState(false);
  const favorites = useRecoilValue(favoriteItems);
  const router = useRouter();
  const setFavorite = useSetRecoilState(favoritesState);
  const recentlyViewed = useRecoilValue(recentlyViewedItems);
  const workflows = useRecoilValue(workflowItems);
  const assignments = useRecoilValue(assignmentItems); 
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    if(!workflows[0]) return;

    setStartDate(new Date(workflows[0].startDate));
    console.log(startDate.getFullYear());
    
  }, [workflows]);

  const toggleFavoriteItem = async (itemId: string) => {
    const item = favorites.find(item => item.id === itemId);
    if (!item) return;

    const { isFavorite, type, name, location } = item;
    const updatedFavoriteStatus = !isFavorite;
    
    // Helper to update favorite state
    const updateFavoriteState = (isFavorite: boolean) => {
      setFavorite(prevFavorites => ({
        ...prevFavorites,
        favorites: isFavorite
          ? [...prevFavorites.favorites, { id: itemId, name, type, location, isFavorite: updatedFavoriteStatus }]
          : prevFavorites.favorites.filter(fav => fav.id !== itemId)
      }));
    };

    try {
      const linkType = type === "folder" ? "folder" : "file";
      const endpoint = `${BASE_URL}/api/v1/${linkType}/${itemId}`;
      await axios.put(endpoint, { name, isFavorite: updatedFavoriteStatus }, {
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      updateFavoriteState(!isFavorite); // Update favorite state based on new favorite status
    } catch (error) {
      console.log(error);
      
    }
  };

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
              {getFileIcon('docx',"h-5 w-5 text-blue-500")}
              <CardTitle className="text-sm font-medium">Documents and Versions Uploaded</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-3rem)] bg-gray-100 flex items-center justify-center text-muted-foreground">
              No documents to display
            </CardContent>
          </Card>
          
          {/* ------------------------------------------------------------------------------- */}
          {/* My Assignments */}
          <Card className="row-span-2 rounded-none">
            <CardHeader 
              className="flex flex-row items-center gap-2 border-b h-1/6 cursor-pointer hover:bg-gray-100"
              onClick={()=>router.push('/myassignment')} >
              {getFileIcon('check',"h-6 text-green-500 stroke-2")}
              <CardTitle className="text-sm font-medium">My Assignments</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-3rem)] bg-gray-100 flex flex-col items-center px-0 text-muted-foreground">
            {assignments.map((item) =>(
              <div className="flex items-start gap-2 text-sm">
                {getFileIcon('workflow',"h-6 w-6 fill-green-400")}
                <div className="border-b">
                  <div className="text-black">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.location}</div>
                </div>
                <div className="flex items-center gap-2">
                </div>
              </div>
            ))}
            </CardContent>
          </Card>

          {/* ------------------------------------------------------------------------------- */}
          {/* My Workflows */}
          <Card className="row-span-2 rounded-none">
            <CardHeader 
              className="flex flex-row items-center gap-2 border-b h-1/6 cursor-pointer hover:bg-gray-100"
              onClick={()=>setWorkflowVisible(true)}>
              {getFileIcon('workflow',"h-8")}
              <CardTitle className="text-sm font-medium">My Workflows</CardTitle>
            </CardHeader>
              <CardContent className="h-[calc(100%-3rem)]  flex bg-gray-800 text-white flex-col items-center p-2 text-muted-foreground">
                {workflows.length > 1 ?
                  <div className="flex w-full h-full items-center justify-center gap-2">
                    <div className="flex flex-col items-center cursor-pointer justify-center text-2xl rounded-full border-[20px] bg-transparent border-blue-400 w-36 h-36 ">
                        <div className="flex items-center justify-center cursor-default flex-col w-full h-full rounded-full">
                          <span className="cursor-pointer" onClick={()=> setWorkflowVisible(true)}>{workflows.length}</span>
                          <span className="cursor-pointer" onClick={()=> setWorkflowVisible(true)}>Total</span>
                        </div>
                    </div>
                    <div className=" flex justify-center mr-12 ml-3 items-center text-sm text-gray-300 gap-2">
                      <span className="text-lg text-blue-300 cursor-pointer">{workflows.length}</span>
                      <span className="text-xs cursor-pointer" onClick={()=> setWorkflowVisible(true)}>On time</span>
                    </div>
                  </div>
                :
                <div>
                {workflows[0] && 
                  <> 
                    <div className="flex items-center justify-center gap-6 mb-2">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={()=> setWorkflowVisible(true)}>
                        <span className="text-xl">1</span>
                        <span className="text-gray-400 text-xl">Total</span>
                      </div>
                      <div className="flex items-center gap-2 cursor-pointer" onClick={()=> setWorkflowVisible(true)}>
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-white text-xl">{workflows[0].status}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-gray-400 text-base">Workflow name</div>
                        <div className="text-sm text-white font-semi-bold">{workflows[0].workflowName}</div>
                      </div>
                      
                      <div>
                        <div className="text-gray-400 text-base">Current step</div>
                        <div className="text-sm text-white font-semi-bold">{workflows[0].currentStep}</div>
                      </div>
                      
                      <div className="flex justify-between">
                        <div>
                          <div className="text-gray-400 text-base">Assigned to</div>
                          <div className="text-sm text-white font-semi-bold">{workflows[0].assignedTo}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-base">Start date</div>
                          <div className="text-sm text-white font-semi-bold">{new Date(workflows[0].startDate).toLocaleString('default', { month: 'long' })+ " "+new Date(workflows[0].startDate).getDate()+ ", " +new Date(workflows[0].startDate).getFullYear()}</div>
                        </div>
                      </div>
                    </div>
                  </>}
                  </div>
                  }
            </CardContent>
          </Card>

          {/* ------------------------------------------------------------------------------- */}
          {/* Favorites */}
          <Card className="row-span-2 rounded-none">
              <CardHeader className="flex flex-row items-center gap-2 border-b h-1/6 cursor-pointer hover:bg-gray-100" 
                          onClick={()=>router.push('/favorites')}>
                {getFileIcon('star',"h-5 w-5 text-yellow-500 stroke-2")}
                  <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              </CardHeader>
              {favorites.length > 0 ? 
              <CardContent className="h-[calc(100%-3rem)] bg-gray-100 flex flex-col items-center px-0 text-muted-foreground">
                {favorites.map((item:any)=>(
                  <div 
                    key={item.id}
                    onDoubleClick={() => handleDoubleClick(item.id,item.type)}
                    className="flex justify-between cursor-pointer border gap-2 w-full text-black p-1 px-2 bg-grey-100" >
                      <div className="flex gap-2 items-center">
                        {getFileIcon(item.type,"h-5")}
                        <span className="text-sm ">{item.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) =>{ 
                          toggleFavoriteItem(item.id)
                        }}
                        aria-label={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        {getFileIcon('star',`${item.isFavorite ? "fill-yellow-400" : "fill-none"}`)}
                      </Button>
                  </div>
                ))}
              </CardContent>
              :
              <>
                
                <CardContent className="h-[calc(100%-3rem)] flex flex-col items-center justify-center text-muted-foreground">
                  <FileText className="h-12 w-12 text-gray-200 mb-2" />
                  There are no items to display.
                </CardContent>
              </>
              }
          </Card>

          {/* ------------------------------------------------------------------------------- */}
          {/* Recently Accessed */}
          <Card className="row-span-2 rounded-none">
            <CardHeader className="flex flex-row items-center gap-2 border-b h-1/6 cursor-pointer hover:bg-gray-100" 
                          onClick={()=>router.push('/recentlyaccessed')}>              
              {getFileIcon('clock',"h-5 w-5 text-purple-500")}
              <CardTitle className="text-sm font-medium">Recently Accessed</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-3rem)] bg-gray-100 flex flex-col items-center px-0 text-muted-foreground">
            {recentlyViewed.map((item:any)=>(
                  <div 
                    key={item.id}
                    className="flex justify-between cursor-pointer gap-2 w-full text-black py-2 px-2 border bg-grey-100 hover:bg-gray-100" >
                      <div className="flex gap-2 items-center">
                        {getFileIcon(item.type,"h-6 w-6")}
                        <span className="text-sm">{item.name}</span>
                      </div>
                      
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* ------------------------------------------------------------------------------- */}
          {/* Enterprise */}
          <Button variant="ghost" 
                  className="bg-purple-900 hover:bg-purple-950 hover:text-white text-white flex flex-col items-center justify-center gap-2 h-full rounded-none"
                  onClick={()=>router.push('/enterprise')}>
            <Folder className="h-6" />
            <span className="text-xs text-center">Enterprise Folder</span>
          </Button>

          {/* ------------------------------------------------------------------------------- */}          
          {/* Personal Workspace */}
          <Button variant="ghost" 
                  className="bg-zinc-700 hover:bg-zinc-800 hover:text-white text-white flex flex-col items-center justify-center gap-2 h-full rounded-none"
                  onClick={()=>router.push('/personalworkspace')}>
            <Folder className="h-6 w-6" />
            <span className="text-xs text-center">Personal Workspace</span>
          </Button>

          {/* ------------------------------------------------------------------------------- */}          
          {/* User Guides */}
          <Button variant="ghost" 
                  className="bg-blue-600 hover:bg-blue-700 hover:text-white text-white flex flex-col items-center justify-center gap-2 h-full rounded-none"
                  onClick={()=>router.push('/userguide')}>
            <Folder className="h-6 w-6" />
            <span className="text-xs text-center">User Guides</span>
          </Button>

          {/* ------------------------------------------------------------------------------- */}          
          {/* NFA and Letters Workflow Report */}
          <Button variant="ghost" 
                  className="bg-blue-800 hover:bg-blue-900 hover:text-white text-white flex flex-col items-center justify-center gap-2 h-full rounded-none"
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