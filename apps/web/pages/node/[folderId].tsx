'use client'

import { useParams } from "next/navigation";
import React, { useEffect } from "react"
import { Badge, ChevronDown, FileText, Folder, LayoutGrid, LayoutList, Search, Star, Plus, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef, useCallback } from "react"
import FileManager from "@/components/FileManger"
import GridLayout from "@/components/Gridlayout"
import { toast } from "@/hooks/use-toast"
import { getFileIcon } from "../icon/icon";
import Header from "@/components/Header";
import axios from "axios";
import { BASE_URL } from "@/next.config";

const filesList = [
    
    {
      id: "6",
      name: "Post-facto for Nextroot.pdf",
      type: "pdf",
      size: "71 KB",
      modified: "07/26/2023 12:28 PM",
      isFavorite: false
    }
  ]
  
  interface File {
    id: string,
    name: string,
    type: string,
    items?: string,
    size?: string,
    modified: string,
    isFavorite: boolean
  }

const folderId = () => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [viewType, setViewType] = useState<'list' | 'grid'>('list')
  const [files, setFiles] = useState<File[]>([]);
  const [newFolderName, setNewFolderName] = useState('new folder')
  const [copiedFolders, setCopiedFolders] = useState<File[]>([])
  const folderId  = useParams();


  const toggleAll = (checked: boolean) => {
    setSelectedFiles(checked ? files.map(file => file.id) : [])
  }

  useEffect(() => {
    if(!folderId?.folderId) return;
    async function fetchData() {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/folder/${folderId.folderId}`,{
          headers:{
            authorization : `Bearer `+ localStorage.getItem('token')
          }
        })
        setFiles([...res.data.folderData,...res.data.fileData]);
      }
      catch (error) {
        console.log(error);
      }
    }
      fetchData();
  }, [folderId]);

  const toggleFile = useCallback((itemId: string, checked: boolean) => {
    setSelectedFiles(current => {
      return checked
        ? [...current, itemId]
        : current.filter((id) => id !== itemId);
    });
  }, []);

  return (
    <div className="min-h-screen"
        style={{
            backgroundColor: '#ffffff', // Light theme background color
            color: '#171717', // Light theme text color
        }}>
      <div className="border-b">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Badge className="h-6 w-6 rounded-full"></Badge>
            <h1 className="text-lg font-semibold">30079647 Home</h1>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setViewType(current => current === 'list' ? 'grid' : 'list')}>
              {viewType === 'list' ? <LayoutGrid className="h-4 w-4" /> : <LayoutList className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Star className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Header
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        items={files}
        setItems={setFiles}
        parentFolderId={folderId?.folderId as string}
      />

      <div>
        {viewType === 'list' ? (
          <FileManager
            headers={["Name","Size","Modified"]}
            items={files}
            setItems={setFiles}
            hasFavorite={true}
            parentFolderId={folderId?.folderId as string}
            copiedItems={copiedFolders}
            setCopiedItems={setCopiedFolders}
            toggleItem={toggleFile}
            toggleAll={toggleAll}
            selectedItems={selectedFiles}
            setSelectedItems={setSelectedFiles}
          />
          
        ) : (
          <GridLayout 
            items={files}
            setItems={setFiles}
            selectedItems={selectedFiles}
            toggleItem={toggleFile}
            toggleAll={toggleAll}
          />
        )}
      </div>
    </div>
  );
};

export default folderId;
