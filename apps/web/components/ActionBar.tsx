'use client'
import { Copy, Clipboard, Trash, Edit2, Workflow } from "lucide-react";


import { Button } from "./ui/button";
import axios from "axios";
import { BASE_URL } from "@/next.config";
import { toaster } from "@/pages/admin";
import { copyItemState } from "@/lib/store/atoms/copyItem";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useState } from "react";
import { createUniqueName } from "./FileManger";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import StartWorkflow from "./StartWorkflow";


interface File {
    id: string,
    name: string,
    type: string,
    items?: string,
    size?: string,
    modifiedAt: string | Date,
    isFavorite: boolean,
    contentType?:string
}

interface ActionBarProps {
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
    }: ActionBarProps
) => {

    const [copiedItem, setCopiedItem] = useRecoilState(copyItemState);
    
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isWorkflowDialogOpen, setIsWorkflowDialogOpen] = useState(false);
    const [type, setType] = useState<string>();

  
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
          contentType: item.contentType
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

  const handleDisabledWorkflowCreation = () =>{
    if(selectedItems.length === 0) return true;

    for( const selectedItem of selectedItems){
      const type = items.filter((item) => item.id === selectedItem)[0].type;
      if(!type || type === "folder") {
        return true;
      };
    }
    return false;
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
            <Button onClick={() => setIsDialogOpen(true)} disabled={selectedItems.length === 0} className="bg-white text-black hover:bg-gray-300">
              <Trash className=" h-4 w-4" />
              Delete
            </Button>
            <Button onClick={handleRenameClick} disabled={selectedItems.length === 0} className="bg-white text-black hover:bg-gray-300">
              <Edit2 className=" h-4 w-4" />
              Rename
            </Button>
            <Button onClick={() => setIsWorkflowDialogOpen(true)} disabled={handleDisabledWorkflowCreation()} className="bg-white text-black hover:bg-gray-300">
              <Workflow className=" h-4 w-4" />
              Create Workflow
            </Button>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white text-black">
            <DialogHeader>
              <DialogTitle>Delete</DialogTitle>
              <DialogDescription>
                "Are you sure you want to delete these items?" 
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="submit" className={`text-white "bg-red-500 hover:bg-red-600"`} onClick={() => {
                deleteItems();
                setIsDialogOpen(false)
              }}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {isWorkflowDialogOpen &&
          <StartWorkflow 
              setIsOpen={setIsWorkflowDialogOpen} 
              selectedWorkflow={type} setSelectedWorkflow={setType} 
              setItems={setItems}  
              items={items} 
              selectedItems={selectedItems} 
              setSelectedItems={setSelectedItems} 
              />
        }
    </div>
  )
};

export default ActionBar;
