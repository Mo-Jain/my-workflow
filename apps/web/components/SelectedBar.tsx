'use client'
import { Copy, Clipboard, Trash, Edit2 } from "lucide-react";


import { Button } from "./ui/button";
import axios from "axios";
import { BASE_URL } from "@/next.config";
import { toaster } from "@/pages/admin";
import { copyItemState } from "@/lib/store/atoms/copyItem";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import { useState } from "react";


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
    editingFolderId:string | null;
    setEditingFolderId : React.Dispatch<React.SetStateAction<string | null>>;
    editingFolderName: string;
    setEditingFolderName: React.Dispatch<React.SetStateAction<string>>;
  }

const SelectedBar = (
    {
        selectedItems,
        setSelectedItems,
        items,
        setItems,
        parentFolderId,
        editingFolderId,
        setEditingFolderId,
        editingFolderName,
        setEditingFolderName
    }: FileManagerProps
) => {

    const [copiedItem, setCopiedItem] = useRecoilState(copyItemState);
    const router = useRouter();

    const createUniqueName = (name: string) => {
      let uniqueName = name;
      let counter = 1;
  
      const extensionIndex = uniqueName.lastIndexOf('.');
      const baseName = extensionIndex !== -1 ? uniqueName.slice(0, extensionIndex) : uniqueName;
      const extension = extensionIndex !== -1 ? uniqueName.slice(extensionIndex) : '';
  
      while (items.some(item => item.name === uniqueName)) {
          uniqueName = `${baseName}(${counter})${extension}`;
          counter++;
      }
  
      return uniqueName;
    };
  
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
          toaster("delete", item.id, false);
        } catch (e) {
          toaster("delete", item.id, true);
        }
      }
    }
  
    const pasteFileOrFolder = async (item: any) => {
      const date = new Date();
      const unixTimestampInSeconds = Math.floor(date.getTime() / 1000);
      const uniqueName = createUniqueName(item.name);
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
          toaster("paste", item.id, false);
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
      toaster('copie','',false);
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
        setEditingFolderId(selectedItems[0])
        const folderName = items.filter((item) => selectedItems?.includes(item.id))[0].name
        setEditingFolderName(folderName)
      }
    }

    const handleRenameKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>, itemId: string, itemName: string, itemType: string) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        if(editingFolderName.length === 0){
          toaster("rename",'',true)
          return
        }
        const uniqueName = createUniqueName(editingFolderName)
        setItems(items.map(item =>
          item.id === itemId ? { ...item, name: uniqueName } : item
        ))
        setEditingFolderId(null)
        toaster("rename",itemId,false)
  
        try {
          const linkType = itemType === "folder" ? "folder" : "file";
          const endpoint = `${BASE_URL}/api/v1/${linkType}/${itemId}`;
          await axios.put(endpoint, { name : uniqueName }, {
            headers: {
              "Content-type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          });
    
        } catch (error) {
          console.log(error);
          // Rollback favorite status in case of an error
          setItems(items.map(item =>
            item.id === itemId ? { ...item, name: itemName } : item
          ))
        }
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
            <Button onClick={deleteItems} disabled={selectedItems.length === 0} className="bg-white text-black hover:bg-gray-300">
              <Trash className=" h-4 w-4" />
              Delete
            </Button>
            <Button onClick={handleRenameClick} disabled={selectedItems.length === 0} className="bg-white text-black hover:bg-gray-300">
              <Edit2 className=" h-4 w-4" />
              Rename
            </Button>
        </div>
    </div>
  )
};

export default SelectedBar;
