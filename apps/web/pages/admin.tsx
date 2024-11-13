import { Star, Copy, Clipboard, TrashIcon, ChevronsDown } from "lucide-react";
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
  const [newFolderParentId, setNewFolderParentId] = useState('d63b219b-8158-4149-8a16-bdc98f8cf2bb')

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
  async function deleteRecentlyViewed(id:number){
    const res = await deleteFunction("recentlyViewed",setRecentlyViewedList,id);
  }
  async function deleteAssignment(id:number){
    const res = await deleteFunction("assignments",setAssignmentsList,id);
  }
  async function deleteWorkflow(id:number){
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
  setNewFolderParentId('d63b219b-8158-4149-8a16-bdc98f8cf2bb')
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
                    <Button variant="outline">
                      Add Folder <ChevronsDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={handleEnterpriseFolder}>Enterprise</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>Other</DropdownMenuItem>
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
            { recentlyViewedList.map((recentlyViewed:any) =>(
                <TableBody>
                        <TableCell>{recentlyViewed.fileName}</TableCell>
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
                </TableBody>
            ))}
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
            { assignmentsList.map((assignment:any) =>(
                <TableBody>
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

                </TableBody>
            ))}
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
            { workflowList.map((workflow:any) =>(
                <TableBody>
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
                </TableBody>
            ))}         
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
      </div>
    </div>
  );
}
