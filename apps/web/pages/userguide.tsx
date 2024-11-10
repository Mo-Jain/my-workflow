import * as React from "react"
import { ChevronDown, FileText, Folder, LayoutGrid, LayoutList, MessageSquare, Star, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import FileManager from "@/components/FileManger"
import {getFileIcon} from "./icon/icon"
import GridLayout from "@/components/Gridlayout"

// Sample data - in a real app this would come from your backend
const filesList = [
  {
    id: 1,
    name: "ANR-PROD-ECM-UG-ECM.pdf",
    type: "pdf",
    size: "4 MB",
    modified: "08/02/2022 10:44 AM",
    isFavorite: true
  },
  {
    id: 2,
    name: "ANR-PROD-ECM-UG-NFA & Letters Workflow Manual.pdf",
    type: "pdf",
    size: "8 MB",
    modified: "08/14/2022 4:35 PM",
    isFavorite: false
  },
  {
    id: 3,
    name: "ANR-PROD-UG-CS Mobile.pdf",
    type: "pdf",
    size: "578 KB",
    modified: "08/02/2022 10:44 AM",
    isFavorite: false
  },
  {
    id: 4,
    name: "Raise Incident Guide.docx",
    type: "docx",
    size: "64 KB",
    modified: "04/14/2023 8:17 PM",
    isFavorite: true
  },
  {
    id: 5,
    name: "XENG Engineering-20220613_191213-Meeting Recording.mp4",
    type: "video",
    size: "205 MB",
    modified: "04/14/2023 8:18 PM",
    isFavorite: false
  }
]
interface File {
  id: number,
  name: string,
  type: string,
  items?: string,
  size?: string,
  modified: string,
  isFavorite: boolean
}
export default function UserGuides() {
  const [selectedFiles, setSelectedFiles] = React.useState<number[]>([])
  const [sortConfig, setSortConfig] = React.useState<{
    key: 'name' | 'size' | 'modified',
    direction: 'asc' | 'desc'
  }>({ key: 'name', direction: 'asc' })
  const [viewType, setViewType] = React.useState<'list' | 'grid'>('list')
  const [files, setFiles] = React.useState<File[]>(filesList);


  const toggleAll = (checked: boolean) => {
    setSelectedFiles(checked ? files.map(file => file.id) : [])
  }

  const toggleFile = (fileId: number) => {
    setSelectedFiles(current =>
      current.includes(fileId)
        ? current.filter(id => id !== fileId)
        : [...current, fileId]
    )
  }

  const toggleFavorite = (fileId: number) => {
    setFiles(prevFiles =>
      prevFiles.map(file =>
        file.id === fileId ? { ...file, isFavorite: !file.isFavorite } : file
      )
    );
  
    // Update the original itemsList array
    const fileIndex = filesList.findIndex(file => file.id === fileId);
    if (fileIndex > -1) {
      filesList[fileIndex].isFavorite = !filesList[fileIndex].isFavorite;
    }
  };



  const handleSort = (key: 'name' | 'size' | 'modified') => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    })
  }

  const toggleViewType = () => {
    setViewType(current => current === 'list' ? 'grid' : 'list')
  }

  return (
    <div className="min-h-screen "
      style={{
        backgroundColor: '#ffffff', // Light theme background color
        color: '#171717', // Light theme text color
      }}>
      <div className="border-b">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-orange-400" />
            <h1 className="text-lg font-semibold">User Guides</h1>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleViewType}>
              {viewType === 'list' ? <LayoutGrid className="h-4 w-4" /> : <LayoutList className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Star className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div >
        
      <div>
        {viewType === 'list' ? (
          <>
            <FileManager
              headers={["Name","Size","Modified"]}
              items={files.map(({ isFavorite, ...rest }) => rest)}
              toggleFavorite={toggleFavorite}
              hasSelect={true}
              iconOne={(file) =>getFileIcon(file.type)}
              />
          </>
        ) : (
          <GridLayout 
            items={files}
            selectedItems = {selectedFiles}
            toggleItem = {toggleFile}
            toggleAll = {toggleAll}
            />
        )}
        </div>
      </div>
    </div>
  )
}