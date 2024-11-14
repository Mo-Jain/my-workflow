import {useEffect, useState} from "react"
import { Badge, ChevronDown, Folder, LayoutGrid, LayoutList, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import FileManager from "@/components/FileManger"
import { getFileIcon, getFileThumbnail } from "./icon/icon"
import GridLayout from "@/components/Gridlayout"
import Header from "@/components/Header"
import axios from "axios"
import { BASE_URL } from "@/next.config"


interface Folder {
  id: string,
  name: string,
  items: string,
  modified: string,
  isFavorite: boolean
}

const folderList = [
  {
    id: 1,
    name: "ATMSL RAILWAYS",
    items: "14 items",
    modified: "10/24/2024 2:44 PM",
    isFavorite: false
  },
  {
    id: 2,
    name: "Bijahan",
    items: "13 items",
    modified: "07/01/2022 1:16 PM",
    isFavorite: true
  },
  {
    id: 3,
    name: "Business Analytics",
    items: "2 items",
    modified: "07/01/2022 1:59 PM",
    isFavorite: false
  },
  {
    id: 4,
    name: "Business Development",
    items: "37 items",
    modified: "07/16/2024 4:34 PM",
    isFavorite: true
  },
  {
    id: 5,
    name: "Cement",
    items: "2 items",
    modified: "09/12/2022 11:58 AM",
    isFavorite: false
  },
  {
    id: 6,
    name: "Compliances & Sustainability",
    items: "0 items",
    modified: "07/01/2022 4:15 PM",
    isFavorite: false
  }
]

export default function Enterprise() {
  const [selectedFolders, setSelectedFolders] = useState<string[]>([])
  const [viewType, setViewType] = useState<'list' | 'grid'>('list');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [newFolderName, setNewFolderName] = useState('new folder');
  const [workspaceId,setWorkspaceId] = useState("")


  const toggleAll = (checked: boolean) => {
    setSelectedFolders(checked ? folders.map(folder => folder.id) : [])
  }

  const toggleFolder = (folderId: string) => {
    setSelectedFolders(current =>
      current.includes(folderId)
        ? current.filter(id => id !== folderId)
        : [...current, folderId]
    )
  }
  
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/enterprise`,{
          headers:{
            authorization : `Bearer `+ localStorage.getItem('token')
          }
        })
        const enterpriseFolder = res.data.enterpriseFolder;
        setFolders(enterpriseFolder);
        setWorkspaceId(res.data.EnterperiseId);
      }
      catch (error) {
        console.log(error);
      }
    }
    fetchData();
}, []);



  return (
    <div className="min-h-screen "
      style={{
        backgroundColor: '#ffffff', // Light theme background color
        color: '#171717', // Light theme text color
      }}>
      <div className="border-b">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Badge className="text-xs fill-blue-500 text-center">Enterprise</Badge>
            <h1 className="text-lg font-semibold">Enterprise</h1>
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
        items={folders}
        setItems={setFolders}
        parentFolderId={workspaceId}
      />
      <div>
        {viewType === 'list' ? (
            <>
              <FileManager
                headers={["Name","Size","Modified"]}
                items={folders}
                setItems={setFolders}
                hasFavorite={true}
                toggleAll={toggleAll}
                toggleItem={toggleFolder}
                selectedItems={selectedFolders}
              />
            </>
        ) : (
          <GridLayout 
            items={folders.map((folder)=>({...folder,type:"folder"}))}
            setItems={setFolders}
            selectedItems = {selectedFolders}
            toggleItem = {toggleFolder}
            toggleAll = {toggleAll}
            />
        )}


        <div className="flex items-center justify-between mt-4 p-2">
          <div className="text-sm text-muted-foreground">
            About 46 items
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">30 per page</span>
            <div className="flex">
              <Button variant="outline" className="h-8 rounded-r-none bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" className="h-8 rounded-l-none">
                2
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}