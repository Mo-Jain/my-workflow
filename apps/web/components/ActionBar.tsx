'use client'
import { Copy, Clipboard, Trash, Edit2, Workflow } from "lucide-react";


import { Button } from "./ui/button";
import axios from "axios";
import { BASE_URL } from "@/next.config";
import { toaster } from "@/pages/admin";
import { copyItemState } from "@/lib/store/atoms/copyItem";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import { useState } from "react";
import { createUniqueName } from "./FileManger";
import { workflowState } from "@/lib/store/atoms/workflow";
import { assignmentState } from "@/lib/store/atoms/assignment";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";


interface File {
    id: string,
    name: string,
    type: string,
    items?: string,
    size?: string,
    modifiedAt: string | Date,
    isFavorite: boolean,
}

interface FileManagerProps {
    selectedItems: string[];
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
    items: File[]; 
    setItems: React.Dispatch<React.SetStateAction<any[]>>; 
    parentFolderId: string;
    setEditingItemId : React.Dispatch<React.SetStateAction<string | null>>;
    setEditingItemName: React.Dispatch<React.SetStateAction<string>>;
  }

const ActionBar = (
    {
        selectedItems,
        setSelectedItems,
        items,
        setItems,
        parentFolderId,
        setEditingItemId,
        setEditingItemName
    }: FileManagerProps
) => {

    const [copiedItem, setCopiedItem] = useRecoilState(copyItemState);
    const router = useRouter();
    const setWorkflow = useSetRecoilState(workflowState);
    const setAssignments = useSetRecoilState(assignmentState);
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [action, setAction] = useState<"delete" | "workflow">("delete");
  
    const deleteItems = async () => {
      if (!selectedItems || selectedItems.length === 0) return;
      const itemsToDelete = items.filter((item) => selectedItems.includes(item.id))
      setSelectedItems && setSelectedItems([]);
      for (const item of itemsToDelete) {
        try {
          if(item.type === "folder") {  
            await axios.delete(`${BASE_URL}/api/v1/folder/${item.id}`, {
              headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
              }
            });
          }
          else{
            await axios.delete(`${BASE_URL}/api/v1/file/${item.id}`, {
              headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
              }
            });
          }
          setItems(prevItems => prevItems.filter(file => file.id !== item.id));
          toaster("deleted", item.id, false);
        } catch (e) {
          toaster("delete", item.id, true);
        }
      }
    }
  
    const pasteFileOrFolder = async (item: any) => {
      const date = new Date();
      const unixTimestampInSeconds = Math.floor(date.getTime() / 1000);
      const {uniqueName,type} = createUniqueName(item.name,items);
      const payload = {
          name: uniqueName,
          parentFolderId: parentFolderId ?? null,
          size: item.size,
          type: item.type,
          modifiedAt: unixTimestampInSeconds,
      };
  
      try {
          if (item.type === "folder") {
              const res = await axios.post(`${BASE_URL}/api/v1/folder`, {
                  name: uniqueName,
                  parentFolderId: payload.parentFolderId,
              }, {
                  headers: {
                      "Content-type": "application/json",
                      "Authorization": `Bearer ${localStorage.getItem("token")}`
                  }
              });
  
              setItems(prevItems => [
                  ...prevItems,
                  { id: res.data.id, name: uniqueName, items: "0", type: "folder", modifiedAt: date.toISOString(), isFavorite: false }
              ]);
          } else {
              console.log("inside else",payload); 
              payload.name = uniqueName;
              const res = await axios.post(`${BASE_URL}/api/v1/file`, payload, {
                  headers: {
                      "Content-type": "application/json",
                      "Authorization": `Bearer ${localStorage.getItem("token")}`
                  }
              });
  
              setItems(prevItems => [
                ...prevItems,
                  { id: res.data.id, name: uniqueName, size: item.size, type: item.type, modifiedAt: date.toISOString(), isFavorite: false }
              ]);
          }
          toaster("pasted", item.id, false);
      } catch (e) {
          toaster("paste", item.id, true);
      }
    };
  
    const pasteItems = async () => {
      if (!copiedItem || copiedItem.length === 0) return;
      // Process each copied folder or file
      for (const item of copiedItem) {
          await pasteFileOrFolder(item);
      }
      setSelectedItems && setSelectedItems([]);
    };
  
    const copySelectedItems = () => {
      const itemsToCopy = items.filter((item) => selectedItems?.includes(item.id))
      setCopiedItem && setCopiedItem(itemsToCopy)
      // console.log(copiedItem);
      toaster('copied','',false);
    }
  
    const handleDoubleClick = (id:string,type:string) => {
      if(type === "folder"){
        router.push(`/node/${id}`)
      }
    }
  
    
    const handleRenameClick = () => {
      if( selectedItems && selectedItems.length > 1){
        toaster("rename more than one",'',true)
        return
      }
      
      if(selectedItems){
        setEditingItemId(selectedItems[0])
        const folderName = items.filter((item) => selectedItems?.includes(item.id))[0].name
        setEditingItemName(folderName)
      }
    }

    function formatDate(date:Date) {
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

    const selectAction = (action: "delete" | "workflow") => {
      setAction(action);
      setIsDialogOpen(true);
    }

    const handleAction = async () => {
      if(action === "delete"){
        deleteItems();
      }
      else{
        handleStartWorkflowClick();
      }
    }

    const handleStartWorkflowClick = async () => {
      if(!selectedItems) return;

      const formattedDate = formatDate(new Date());
      for( const selectedItem of selectedItems){
        const type = items.filter((item) => item.id === selectedItem)[0].type;
        if(!type || type === "folder") return;
      }

      try{
        const res = await axios.post(`${BASE_URL}/api/v1/workflow`, {
          workflowName: "30079647 "+"NFA Form - "+formattedDate,
          currentStep: "NFA Form - "+formattedDate,
        }, {
          headers: {
              "Content-type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        const workflowId = res.data.workflow.id;
        
        for(const selectedItem of selectedItems){
          const name = items.filter((item) => item.id === selectedItem)[0].name
          await axios.put(`${BASE_URL}/api/v1/file/${selectedItem}`, {
            name: name,
            workflowId: workflowId
          }, {
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          });
        }

        const newWorkflow = {
          id: res.data.workflow.id,
          status: res.data.workflow.status,
          dueDate: res.data.workflow.dueDate,
          type: res.data.workflow.workflowName,
          workflowName: res.data.workflow.workflowName,
          currentStep: res.data.workflow.currentStep,
          assignedTo: res.data.workflow.assignee.name,
          startDate: res.data.workflow.startDate,
          files: res.data.files
        }
        console.log("res.data :",res.data);
        console.log("newWorkflow :",newWorkflow);
        const assignments = {
          id:newWorkflow.id,
          name:newWorkflow.currentStep,
          location:newWorkflow.workflowName,
          dueDate:newWorkflow.dueDate,
          priority:"medium",
          status:newWorkflow.status,
          from:newWorkflow.assignedTo
        }
        setWorkflow(prevWorkflows => ({
          ...prevWorkflows,
          items: [...prevWorkflows.items, newWorkflow]
        }));

        setAssignments(prevAssignments => ({
          ...prevAssignments,
          items: [...prevAssignments.items, assignments]
        }));

        setSelectedItems && setSelectedItems([]);

        toaster("created workflow",res.data.workflow.id,false);
      } catch (e) {
        toaster("create workflow",'',true);
      }
      
    }

    
  
  return (
    <div>
        <div className="flex justify-end space-x-2 items-center py-2 bg-white text-black">
            <Button onClick={copySelectedItems} disabled={selectedItems.length === 0} className="bg-white text-black hover:bg-gray-300">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button onClick={pasteItems} disabled={copiedItem.length === 0} className="bg-white text-black hover:bg-gray-300">
              <Clipboard className=" h-4 w-4" />
              Paste
            </Button>
            <Button onClick={() => selectAction("delete")} disabled={selectedItems.length === 0} className="bg-white text-black hover:bg-gray-300">
              <Trash className=" h-4 w-4" />
              Delete
            </Button>
            <Button onClick={handleRenameClick} disabled={selectedItems.length === 0} className="bg-white text-black hover:bg-gray-300">
              <Edit2 className=" h-4 w-4" />
              Rename
            </Button>
            <Button onClick={() => selectAction("workflow")} disabled={selectedItems.length === 0} className="bg-white text-black hover:bg-gray-300">
              <Workflow className=" h-4 w-4" />
              Create Workflow
            </Button>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white text-black">
            <DialogHeader>
              <DialogTitle>{ action === "delete" ? "Delete" : "Create Workflow"}</DialogTitle>
              <DialogDescription>
                { action === "delete" ? 
                "Are you sure you want to delete these items?" : 
                "Are you sure you want to create a workflow?"}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="submit" className={`text-white ${action === "delete" ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`} onClick={() => {
                handleAction();
                setIsDialogOpen(false)
              }}>{ action === "delete" ? "Delete" : "Create Workflow"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

    </div>
  )
};

export default ActionBar;
