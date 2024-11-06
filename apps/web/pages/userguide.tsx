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

// Sample data - in a real app this would come from your backend
const files = [
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

export default function UserGuides() {
  const [selectedFiles, setSelectedFiles] = React.useState<number[]>([])
  const [sortConfig, setSortConfig] = React.useState<{
    key: 'name' | 'size' | 'modified',
    direction: 'asc' | 'desc'
  }>({ key: 'name', direction: 'asc' })
  const [viewType, setViewType] = React.useState<'list' | 'grid'>('list')

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

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'video':
        return <Video className="h-4 w-4 text-purple-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

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
        {viewType === 'list' ? (
          <div className="w-full">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableCell className="w-12">
                    <Checkbox
                      checked={selectedFiles.length === files.length}
                      onCheckedChange={toggleAll}
                    />
                  </TableCell>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer w-32"
                    onClick={() => handleSort('size')}
                  >
                    Size {sortConfig.key === 'size' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer w-48"
                    onClick={() => handleSort('modified')}
                  >
                    Modified {sortConfig.key === 'modified' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedFiles.includes(file.id)}
                        onCheckedChange={() => toggleFile(file.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.type)}
                        {file.name}
                      </div>
                    </TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell>{file.modified}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Star className={`h-4 w-4 ${file.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className=" p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {files.map((file) => (
              <Card key={file.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedFiles.includes(file.id)}
                        onCheckedChange={() => toggleFile(file.id)}
                      />
                      {getFileIcon(file.type)}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Star className={`h-4 w-4 ${file.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    </Button>
                  </div>
                  <div className="text-sm font-medium truncate mb-1">{file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {file.size} • {file.modified}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}