'use client'

import { Badge, ChevronDown, FileText, Folder, LayoutGrid, LayoutList, Search, Star, Plus, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useRef, useCallback, useEffect } from "react"
import FileManager from "@/components/FileManger"
import { getIcon } from "./icon/icon"
import GridLayout from "@/components/Gridlayout";
import { toast } from "@/hooks/use-toast"
import Header from "@/components/Header"
import axios from "axios"
import { BASE_URL } from "@/next.config"
import ActionBar from "@/components/ActionBar"


const filesList = [
  {
    id: 1,
    name: "30079647-NFA-1980-PROJ-Mundra-2023-11-00002_6485488",
    type: "folder",
    items: "1 item",
    modified: "11/22/2023 8:12 PM",
    isFavorite: true
  },
  {
    id: 2,
    name: "607131209D",
    type: "folder",
    items: "3 items",
    modified: "02/16/2024 3:28 PM",
    isFavorite: false
  },
  {
    id: 3,
    name: "CFO APPROVAL.xlsx",
    type: "excel",
    size: "47 KB",
    modified: "01/06/2024 10:24 AM",
    isFavorite: false
  },
  {
    id: 4,
    name: "Invoice Delay approval",
    type: "folder",
    items: "6 items",
    modified: "01/16/2024 4:14 PM",
    isFavorite: true
  },
  {
    id: 5,
    name: "NFA for china visit approval.pdf",
    type: "pdf",
    size: "1 MB",
    modified: "11/20/2023 2:46 PM",
    isFavorite: false
  },
  {
    id: 6,
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
  modifiedAt: string | Date,
  isFavorite: boolean,
  contentType?:string
}

export default function PersonalWorkspace() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [viewType, setViewType] = useState<'list' | 'grid'>('list')
  const [files, setFiles] = useState<File[]>([])
  const [newFolderName, setNewFolderName] = useState('new folder')
  const [workspaceId,setWorkspaceId] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editingItemName, setEditingItemName] = useState('')


  const toggleAll = (checked: boolean) => {
    setSelectedFiles(checked ? files.map(file => file.id) : [])
  }

  useEffect(() => {
      async function fetchData() {
        try {
          const res = await axios.get(`${BASE_URL}/api/v1/personal`,{
            headers:{
              authorization : `Bearer `+ localStorage.getItem('token')
            }
          })
          const personalFolder = res.data.personalFolder;
          const personalFiles = res.data.personalFiles;
          setFiles([...personalFolder, ...personalFiles]);
          setWorkspaceId(res.data.personalWorkspaceId);
        }
        catch (error) {
          console.log(error);
        }
      }
      fetchData();
  }, []);

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
        parentFolderId={workspaceId}
      />
      <ActionBar
        items={files}
        setItems={setFiles}
        selectedItems={selectedFiles}
        setSelectedItems={setSelectedFiles}
        parentFolderId={workspaceId}
        setEditingItemId={setEditingItemId}
        setEditingItemName={setEditingItemName}
        />
      <div>
        {viewType === 'list' ? (
          <FileManager
            headers={["Name","Size","Modified"]}
            items={files}
            setItems={setFiles}
            hasFavorite={true}
            toggleItem={toggleFile}
            toggleAll={toggleAll}
            selectedItems={selectedFiles}
            editingItemId={editingItemId}
            setEditingItemId={setEditingItemId}
            editingItemName={editingItemName}
            setEditingItemName={setEditingItemName}
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
  )
}