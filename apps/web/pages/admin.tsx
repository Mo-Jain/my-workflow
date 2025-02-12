'use client'
import { Star, Copy, Clipboard, TrashIcon, ChevronsDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ENTERPRISE_FOLDER_ID } from "../config";
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
    toaster("deleted",id,false);
    return res;      
  }catch(e){
    toaster("delete",id,true);
    return null;
  }
}

export function toaster(action:string, id:string | number, error:boolean){
  if(error){
    toast({
      title: "Error",
      description: `Could not ${action} item ${id}`,
      className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      variant: "destructive",
    })
  }
  else{
    toast({
      title: `Item ${action}`,
      description: `Successfully ${action} ${id}`,
      className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal"
    })
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
  const [newFolderParentId, setNewFolderParentId] = useState(ENTERPRISE_FOLDER_ID)
  const [isRecentlyViewedDialogOpen, setIsRecentlyViewedDialogOpen] = useState(false)
  const [isWorkflowDialogOpen, setIsWorkflowDialogOpen] = useState(false)
  const [fileId, setFileId] = useState('');
  const [newCurrentStep, setNewCurrentStep] = useState('');
  const [newWorkflowName, setNewWorkflowName] = useState('')
  const setWorkflow = useSetRecoilState(workflowState);
  const setRecentlyViewed = useSetRecoilState(recentlyViewedState);
  const [approvalRecords,setApprovalRecords] = useState([]);
  const [workflowDataList,setWorkflowDataList] = useState([]);

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
    const res7 = await axios.get(`${BASE_URL}/api/v1/admin/approvalRecord`); 
    setApprovalRecords(res7.data.approvalRecordData);
    const res6 = await axios.get(`${BASE_URL}/api/v1/admin/workflowData`); 
    setWorkflowDataList(res6.data.workflowDataData);
  }
  
  useEffect(() => {
    fetchData();
  }, []);

  async function deleteUser(id:string){
      await deleteFunction("users",setUserList,id);
  }
  async function deleteFile(id:string){
      await deleteFunction("files",setFileList,id);
  }
  async function deleteFolder(id:string){
      await deleteFunction("folders",setFolderList,id);
  }
  async function deleteRecentlyViewed(id:string){
      await deleteFunction("recentlyViewed",setRecentlyViewedList,id);
  }
  async function deleteWorkflowData(id:string){
    await deleteFunction("workflowData",setWorkflowDataList,id);
  }

  async function deleteApprovalRecord(id:string){
    try{
      const res = await axios.delete(`${BASE_URL}/api/v1/admin/approvlRecord/${id}`);
      setAssignmentsList((items:any) => items.filter((item:any) => item.id !== id));
      toaster("deleted",id,false);
    }catch(e){
      toaster("delete",id,true);
    }
}
  async function deleteWorkflow(id:string){
      await deleteFunction("workflows",setWorkflowList,id);
      
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
      toaster("created",res.data.id,false);
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
      toaster("created",res.data.id,false);
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
      
      toaster("created",res.data.id,false);
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
      dueDate: workflow.dueDate,
      type: workflow.type,
      workflowName: workflow.workflowName,
      currentStep: workflow.currentStep,
      assignedTo: workflow.assignedTo,
      startDate: workflow.startDate,
      actions:workflow.actions
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
      parentFolderId:newFolderParentId ?? null,
      parentFolderName:data.parentFolderName,
      createdAt:new Date().toLocaleDateString(),
      path:data.path
    }
    setFolderList(folderList => [...folderList, folder]);
    toaster("created",res.data.id,false);      
  }catch(e){
    toaster("create",'',true);
  }
  setIsDialogOpen(false)
  setNewFolderName('')
  setNewFolderParentId(ENTERPRISE_FOLDER_ID)
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
                      <TableHead>Workflow Id</TableHead>
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
                        <TableCell>{file.workflowId}</TableCell>
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
            <h2 className="text-lg font-semibold">Approval Record</h2>
            <Table>
                <TableHeader className="bg-gray-100">
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>User Id</TableHead>
                    <TableHead>User Name</TableHead>
                    <TableHead>Workflow Id</TableHead>
                    <TableHead>Assigned Date</TableHead>
                    <TableHead>Approval Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead>Delete</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
            { approvalRecords.map((approvalRecord:any) =>(
                    <TableRow>
                        <TableCell>{approvalRecord.name}</TableCell>
                        <TableCell>{approvalRecord.userId}</TableCell>
                        <TableCell>{approvalRecord.userName}</TableCell>
                        <TableCell>{approvalRecord.workflowId}</TableCell>
                        <TableCell>{approvalRecord.assignedDate}</TableCell>
                        <TableCell>{approvalRecord.approvalDate}</TableCell>
                        <TableCell>{approvalRecord.status}</TableCell>
                        <TableCell>{approvalRecord.actions}</TableCell>
                        <TableCell>
                            <Button className="bg-red-500 text-white" onClick={()=>{deleteApprovalRecord(approvalRecord.id)}}>
                            <TrashIcon className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
              ))}
            </TableBody>
            </Table>
            <br/><br/>


            <h2 className="text-lg font-semibold">Workflow Data</h2>
            <Table>
                <TableHeader className="bg-gray-100">
                <TableRow>
                    <TableHead>Workflow Title</TableHead>
                    <TableHead>User Id</TableHead>
                    <TableHead>User Name</TableHead>
                    <TableHead>Workflow Id</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Workflow Type</TableHead>
                    <TableHead>Reference Number</TableHead>
                    <TableHead>Delete</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
            { workflowDataList.map((workflowData:any) =>(
                    <TableRow>
                        <TableCell>{workflowData.name}</TableCell>
                        <TableCell>{workflowData.userId}</TableCell>
                        <TableCell>{workflowData.userName}</TableCell>
                        <TableCell>{workflowData.workflowId}</TableCell>
                        <TableCell>{workflowData.department}</TableCell>
                        <TableCell>{workflowData.companyName}</TableCell>
                        <TableCell>{workflowData.site}</TableCell>
                        <TableCell>{workflowData.workflowType}</TableCell>
                        <TableCell>{workflowData.referenceNumber}</TableCell>
                        <TableCell>
                            <Button className="bg-red-500 text-white" onClick={()=>{deleteWorkflowData(workflowData.id)}}>
                            <TrashIcon className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
              ))}
            </TableBody>
            </Table>
            <br/><br/>
            <h2 className="text-lg font-semibold">Workflows</h2>
            <Table>
                <TableHeader className="bg-gray-100">
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Creator Id</TableHead>
                    <TableHead>Creator Name</TableHead>
                    <TableHead>Current Step</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Delete</TableHead>

                </TableRow>
                </TableHeader>
                <TableBody>
                { workflowList.map((workflow:any) =>(
                    <TableRow>
                        <TableCell>{workflow.workflowName}</TableCell>
                        <TableCell>{workflow.id}</TableCell>
                        <TableCell>{workflow.creatorId}</TableCell>
                        <TableCell>{workflow.userName}</TableCell>
                        <TableCell>{workflow.currentStep}</TableCell>
                        <TableCell>{workflow.startDate}</TableCell>
                        <TableCell>{workflow.status}</TableCell>
                        <TableCell>{workflow.type}</TableCell>
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
