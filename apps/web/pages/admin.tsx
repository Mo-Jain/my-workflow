'use client'
import { Star, Copy, Clipboard, TrashIcon, ChevronsDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/next.config";
import path from "path";
  import { toast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { workflowState } from "@/lib/store/atoms/workflow";
import { recentlyViewedState } from "@/lib/store/atoms/recentlyViewed";
import { assignmentState } from "@/lib/store/atoms/assignment";
interface Folder {
  id: string
  name: string
  userName: string | null
  creatorId: string | null
  parentFolderId: string | null
  parentFolderName: string | null
  createdAt: string
  path: string
}
async function deleteFunction(name:string,setItems:React.Dispatch<React.SetStateAction<any>>,id:string | number){
  try{
    const res = await axios.delete(`${BASE_URL}/api/v1/admin/${name}/${id}`);
    setItems((items:any) => items.filter((item:any) => item.id !== id));
    toaster("delete",id,false);
    return res;      
  }catch(e){
    toaster("delete",id,true);
    return null;
  }
}

export function toaster(action:string, id:string | number, error:boolean){
  if(error){
    setTimeout(() => {
      toast({
        title: "Error",
        description: `Could not ${action} item ${id}`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
      })
    }, 1000)
  }
  else{
    setTimeout(() => {
      toast({
        title: `Item ${action}d`,
        description: `Successfully ${action}d ${id}`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal"
      })
    }, 1000)
  }
}
export default function Admin(){
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });
   // Memoize the items mapped to their IDs
  const [userList,setUserList] = useState([]);
  const [folderList,setFolderList] = useState<Folder[]>([]);
  const [fileList,setFileList] = useState([]);
  const [workflowList,setWorkflowList] = useState([]);
  const [recentlyViewedList,setRecentlyViewedList] = useState([]);
  const [assignmentsList,setAssignmentsList] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderParentId, setNewFolderParentId] = useState('d810a99b-183e-4e96-8a1e-264d612dcafb')
  const [isRecentlyViewedDialogOpen, setIsRecentlyViewedDialogOpen] = useState(false)
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false)
  const [isWorkflowDialogOpen, setIsWorkflowDialogOpen] = useState(false)
  const [fileId, setFileId] = useState('');
  const [newAssignmentName, setNewAssignmentName] = useState('')
  const [newAssignmentLocation, setNewAssignmentLocation] = useState('');
  const [newCurrentStep, setNewCurrentStep] = useState('');
  const [newWorkflowName, setNewWorkflowName] = useState('')
  const setWorkflow = useSetRecoilState(workflowState);
  const setRecentlyViewed = useSetRecoilState(recentlyViewedState);
  const setAssignments = useSetRecoilState(assignmentState);

  async function fetchData() {
    const res = await axios.get(`${BASE_URL}/api/v1/admin/users`);
    setUserList(res.data.users);
    const res2 = await axios.get(`${BASE_URL}/api/v1/admin/folders`);
    setFolderList(res2.data.folderData);
    const res3 = await axios.get(`${BASE_URL}/api/v1/admin/files`);
    setFileList(res3.data.fileData);
    const res4 = await axios.get(`${BASE_URL}/api/v1/admin/workflows`);
    setWorkflowList(res4.data.workflowData);
    const res5 = await axios.get(`${BASE_URL}/api/v1/admin/recentlyViewed`);
    setRecentlyViewedList(res5.data.recentlyViewedData);
    const res6 = await axios.get(`${BASE_URL}/api/v1/admin/assignments`); 
    setAssignmentsList(res6.data.assignmentData);
  }
  
  useEffect(() => {
    fetchData();
  }, []);

  async function deleteUser(id:string){
    const res = await deleteFunction("users",setUserList,id);
  }
  async function deleteFile(id:string){
    const res = await deleteFunction("files",setFileList,id);
  }
  async function deleteFolder(id:string){
    const res = await deleteFunction("folders",setFolderList,id);
  }
  async function deleteRecentlyViewed(id:string){
    const res = await deleteFunction("recentlyViewed",setRecentlyViewedList,id);
  }
  async function deleteAssignment(id:string){
    const res = await deleteFunction("assignments",setAssignmentsList,id);
  }
  async function deleteWorkflow(id:string){
    const res = await deleteFunction("workflows",setWorkflowList,id);
  }
  const handleEnterpriseFolder = async () => {
    try{
      const res = await axios.post(`${BASE_URL}/api/v1/admin/enterprise`);
      const folder = {
        id: res.data.id,
        name:"enetrprise",
        creatorId:null,
        userName:null,
        parentFolderId:null,
        parentFolderName:null,
        createdAt:new Date().toLocaleDateString(),
        path:"root"
      }
      setFolderList(folderList => [...folderList, folder]);
      toaster("create",res.data.id,false);
    }catch(e){
      toaster("create",'',true);
    }

  }

  const handleCreateRecentlyViewed = async () => {
    try{
      const payload = {
        fileId: fileId
      }
      const res = await axios.post(`${BASE_URL}/api/v1/recentlyviewed`,
        payload,{
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });
      toaster("create",res.data.id,false);
    }catch(e){
      toaster("create",'',true);
    }
    setIsRecentlyViewedDialogOpen(false);
    const res5 = await axios.get(`${BASE_URL}/api/v1/admin/recentlyViewed`);
    setRecentlyViewedList(res5.data.recentlyViewedData);
    setFileId('');
    const recentlyVieweds = res5.data.recentlyViewedData.map((recentlyViewed:any) => ({
      id: recentlyViewed.id,
      name: recentlyViewed.name,
      type: recentlyViewed.type,
      location: recentlyViewed.location,
      isFavorite: recentlyViewed.isFavorite,
      lastAccessed: recentlyViewed.lastAccessed,
      size: recentlyViewed.size,
      created: recentlyViewed.created
    }));
    setRecentlyViewed({
      isLoading:false,
      items:recentlyVieweds
    });
  }

  const handleCreateAssignment = async () => {
    try{
      const payload = {
        name: newAssignmentName,
        location: newAssignmentLocation
      }
      const res = await axios.post(`${BASE_URL}/api/v1/assignment`,
        payload,{
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });
      
      toaster("create",res.data.id,false);
    }catch(e){
      toaster("create",'',true);
    }
    setIsAssignmentDialogOpen(false);
    const res = await axios.get(`${BASE_URL}/api/v1/admin/assignments`);
    setAssignmentsList(res.data.assignmentData);
    const assignments = res.data.assignmentData.map((assignment:any) => ({
      id: assignment.id,
      name: assignment.name,
      location: assignment.location,
      dueDate: assignment.dueDate ?? null,
      priority: assignment.priority,
      status: assignment.status,
      from: assignment.from,
    }));
    setAssignments({
      isLoading:false,
      items:assignments
    });
    
    setNewAssignmentName('');
    setNewAssignmentLocation('');
    
  }

  const handleCreateWorkflow = async () => {
    try{
      const payload = {
        workflowName: newWorkflowName,
        currentStep: newCurrentStep
      }
      const res = await axios.post(`${BASE_URL}/api/v1/workflow`,
        payload,{
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });
      console.log(res.data.workflow);
      
      toaster("create",res.data.id,false);
    }catch(e){
      toaster("create",'',true);
    }
    setIsWorkflowDialogOpen(false);
    const res = await axios.get(`${BASE_URL}/api/v1/admin/workflows`);
    const data = res.data.workflowData;
    setWorkflowList(data);
    const workflows = res.data.workflowData.map((workflow:any) => ({
      id: workflow.id,
      status: workflow.status,
      durDate: workflow.durDate,
      type: workflow.type,
      workflowName: workflow.workflowName,
      currentStep: workflow.currentStep,
      assignedTo: workflow.assignedTo,
      startDate: workflow.startDate
    }));
    setWorkflow({
      isLoading:false,
      items:workflows
    });
    console.log("workflows :",res.data.workflowData);
    setNewWorkflowName('');
    setNewCurrentStep('');
  }

  const handleCreateFolder = async () => {
  try{
    const payload = {
      name: newFolderName,
      parentFolderId: newFolderParentId
    }
    const res = await axios.post(`${BASE_URL}/api/v1/admin/folder`,
      payload,{
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    });

    const data=  res.data;

    const folder = {
      id: data.id,
      name:newFolderName,
      creatorId:data.creatorId,
      userName:data.creatorName,
      parentFolderId:newFolderParentId,
      parentFolderName:data.parentFolderName,
      createdAt:new Date().toLocaleDateString(),
      path:data.path
    }
    setFolderList(folderList => [...folderList, folder]);
    toaster("create",res.data.id,false);      
  }catch(e){
    toaster("create",'',true);
  }
  setIsDialogOpen(false)
  setNewFolderName('')
  setNewFolderParentId('d810a99b-183e-4e96-8a1e-264d612dcafb')
}

  if(!userList || !folderList || !fileList || !workflowList || !recentlyViewedList || !assignmentsList){
    return <div className="w-full bg-white text-black">
      <div className="w-full">
        <div className="flex justify-center items-center">
          Loading ...
        </div>
      </div>
    </div>
  }

  return (
    <div className="w-full bg-white text-black">
      <div className="w-full">
      <br/><br/>
        <h2 className="text-lg font-semibold">Users</h2>
        
            <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>username</TableHead>
                      <TableHead>Delete</TableHead>
                  </TableRow>
                </TableHeader>
                { userList.map((user:any)=>(
                <TableBody>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.usermail}</TableCell>
                        <TableCell>
                            <Button className="bg-red-500 text-white" onClick={()=>{deleteUser(user.id)}}>
                              <TrashIcon className="h-4 w-4"/>
                            </Button>
                        </TableCell>
                </TableBody>
                ))}
          </Table>
          <br/><br/>
          <h2 className="text-lg font-semibold">Files</h2>
          <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Creator Name</TableHead>
                      <TableHead>Creator Id</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>ParentFolderId</TableHead>
                      <TableHead>ParentFolderName</TableHead>
                      <TableHead>CreatedAt</TableHead>
                      <TableHead>Path</TableHead>
                      <TableHead>Delete</TableHead>
                  </TableRow>
                </TableHeader>
          {fileList.map((file:any)=>(
                <TableBody>
                        <TableCell>{file.name}</TableCell>
                        <TableCell>{file.id}</TableCell>
                        <TableCell>{file.userName}</TableCell>
                        <TableCell>{file.creatorId}</TableCell>
                        <TableCell>{file.type}</TableCell>
                        <TableCell>{file.parentFolderId}</TableCell>
                        <TableCell>{file.parentFolderName}</TableCell>
                        <TableCell>{file.createdAt}</TableCell>                    
                        <TableCell>{file.path}</TableCell>
                        <TableCell>
                          <Button className="bg-red-500 text-white" onClick={()=>{deleteFile(file.id)}}>
                            <TrashIcon className="h-4 w-4"/>
                            </Button>
                        </TableCell>
                </TableBody>
          ))}
          </Table>
          <br/>
          <br/><br/>
          <h2 className="text-lg font-semibold">Folder</h2>
            <Table>
                <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Creator Name</TableHead>
                  <TableHead>Creator Id</TableHead>
                  <TableHead>ParentFolderId</TableHead>
                  <TableHead>ParentFolderName</TableHead>
                  <TableHead>CreatedAt</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
          { folderList.map((folder:any) =>(
                    <TableRow>
                        <TableCell>{folder.name}</TableCell>
                        <TableCell>{folder.id}</TableCell>
                        <TableCell>{folder.userName}</TableCell>
                        <TableCell>{folder.creatorId}</TableCell>
                        <TableCell>{folder.parentFolderId}</TableCell>
                        <TableCell>{folder.parentFolderName}</TableCell>
                        <TableCell>{folder.createdAt}</TableCell>                    
                        <TableCell>{folder.path}</TableCell>
                        <TableCell>
                            <Button className="bg-red-500 text-white" onClick={()=>{deleteFolder(folder.id)}}>
                              <TrashIcon className="h-4 w-4"/>
                            </Button>
                        </TableCell>
                    </TableRow>
             ))}
             <TableRow>
              <TableCell colSpan={9}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-52 fles justify-between px-4">
                      <Plus className="ml-2 h-4 w-4" /><span>Add Folder</span><span></span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent >
                    <DropdownMenuItem className="cursor-pointer w-52 flex justify-center" onSelect={handleEnterpriseFolder}>Enterprise</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer w-52 flex justify-center" onSelect={() => setIsDialogOpen(true)}>Other</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
             </TableBody>
            </Table>
            <br/><br/>
            <h2 className="text-lg font-semibold">RecentlyViewed</h2>
            <Table>
                <TableHeader className="bg-gray-100">
                <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Creator Name</TableHead>
                    <TableHead>Creator Id</TableHead>
                    <TableHead>File Id</TableHead>
                    <TableHead>ParentFolderId</TableHead>
                    <TableHead>ParentFolderName</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Delete</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
            { recentlyViewedList.map((recentlyViewed:any) =>(
                        <TableRow>
                        <TableCell>{recentlyViewed.name}</TableCell>
                        <TableCell>{recentlyViewed.id}</TableCell>
                        <TableCell>{recentlyViewed.userName}</TableCell>
                        <TableCell>{recentlyViewed.userId}</TableCell>
                        <TableCell>{recentlyViewed.fileId}</TableCell>
                        <TableCell>{recentlyViewed.parentFolderId}</TableCell>
                        <TableCell>{recentlyViewed.parentFolderName}</TableCell>
                        <TableCell>{recentlyViewed.path}</TableCell>
                       
                        <TableCell>
                            <Button className="bg-red-500 text-white" onClick={()=>{deleteRecentlyViewed(recentlyViewed.id)}}>
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                        </TableCell>
                        </TableRow>
                 ))}
                <TableRow>
                  <TableCell colSpan={9}>
                        <Button variant="outline" 
                        onClick={()=>{setIsRecentlyViewedDialogOpen(true)}}
                        className="w-52 fles justify-between px-4">
                          <Plus className="ml-2 h-4 w-4" /><span>Add Recently viewed</span><span></span>
                        </Button>
                  </TableCell>
                </TableRow>
                </TableBody>
            </Table>
            <br/><br/>
            <h2 className="text-lg font-semibold">Assignment</h2>
            <Table>
                <TableHeader className="bg-gray-100">
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>User Id</TableHead>
                    <TableHead>User Name</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Delete</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
            { assignmentsList.map((assignment:any) =>(
                    <TableRow>
                        <TableCell>{assignment.name}</TableCell>
                        <TableCell>{assignment.userId}</TableCell>
                        <TableCell>{assignment.userName}</TableCell>
                        <TableCell>{assignment.id}</TableCell>
                        <TableCell>{assignment.location}</TableCell>
                        <TableCell>
                            <Button className="bg-red-500 text-white" onClick={()=>{deleteAssignment(assignment.id)}}>
                            <TrashIcon className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
              ))}
                <TableRow>
                  <TableCell colSpan={9}>
                        <Button variant="outline" 
                        onClick={()=>{setIsAssignmentDialogOpen(true)}}
                        className="w-52 fles justify-between px-4">
                          <Plus className="ml-2 h-4 w-4" /><span>Add Assignment</span><span></span>
                        </Button>
                  </TableCell>
                </TableRow>
            </TableBody>
            </Table>
            <br/><br/>
            <h2 className="text-lg font-semibold">Workflows</h2>
            <Table>
                <TableHeader className="bg-gray-100">
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>User Id</TableHead>
                    <TableHead>User Name</TableHead>
                    <TableHead>Current Step</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Delete</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                { workflowList.map((workflow:any) =>(
                    <TableRow>
                        <TableCell>{workflow.workflowName}</TableCell>
                        <TableCell>{workflow.id}</TableCell>
                        <TableCell>{workflow.userId}</TableCell>
                        <TableCell>{workflow.userName}</TableCell>
                        <TableCell>{workflow.currentStep}</TableCell>
                        <TableCell>{workflow.startDate}</TableCell>
                        <TableCell>
                            <Button className="bg-red-500 text-white" onClick={()=>{deleteWorkflow(workflow.id)}}>
                            <TrashIcon className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                  ))}  
                  <TableRow>
                    <TableCell colSpan={9}>
                          <Button variant="outline" 
                          onClick={()=>{setIsWorkflowDialogOpen(true)}}
                          className="w-52 fles justify-between px-4">
                            <Plus className="ml-2 h-4 w-4" /><span>Add Workflow</span><span></span>
                          </Button>
                    </TableCell>
                  </TableRow>       
            </TableBody>
            </Table>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="parentFolderId" className="text-right">
                      Parent Folder ID
                    </Label>
                    <Input
                      id="parentFolderId"
                      value={newFolderParentId}
                      onChange={(e) => setNewFolderParentId(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateFolder}>Create Folder</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isRecentlyViewedDialogOpen} onOpenChange={setIsRecentlyViewedDialogOpen}>
              <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Recently viewed</DialogTitle>
              </DialogHeader>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-left ">File Id</label>
                    <input
                      type="text"
                      value={fileId}
                      onChange={(e) => setFileId(e.target.value)}
                      className="col-span-3 text-sm text-black border-none outline-none rounded-md p-2"
                    />
                  </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateRecentlyViewed}>Create Recently viewed</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
              <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Assignments</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                     Assignment Name
                    </Label>
                    <Input
                      id="name"
                      value={newAssignmentName}
                      onChange={(e) => setNewAssignmentName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="assignmentLocationId" className="text-right">
                     Assignment Location
                    </Label>
                    <Input
                      id="assignmentLocationId"
                      value={newAssignmentLocation}
                      onChange={(e) => setNewAssignmentLocation(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateAssignment}>Create Recently viewed</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isWorkflowDialogOpen} onOpenChange={setIsWorkflowDialogOpen}>
              <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Assignments</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                     Workflow Name
                    </Label>
                    <Input
                      id="name"
                      value={newWorkflowName}
                      onChange={(e) => setNewWorkflowName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="currentStepId" className="text-right">
                     Current Step
                    </Label>
                    <Input
                      id="currentStepId"
                      value={newCurrentStep}
                      onChange={(e) => setNewCurrentStep(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateWorkflow}>Create Recently viewed</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            
      </div>
    </div>
  );
}
