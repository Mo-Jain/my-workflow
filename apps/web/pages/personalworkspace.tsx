import { Badge, ChevronDown, FileText, Folder, LayoutGrid, LayoutList, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

const files = [
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

export default function PersonalWorkspace() {
  const [selectedFiles, setSelectedFiles] = useState<number[]>([])
  const [viewType, setViewType] = useState<'list' | 'grid'>('list')

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
      case 'folder':
        return <Folder className="h-4 w-4 text-orange-400" />
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />
      case 'excel':
        return <FileText className="h-4 w-4 text-green-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getFileThumbnail = (type: string) => {
    switch (type) {
      case 'folder':
        return <Folder className="h-20 w-20 text-orange-400" />
      case 'pdf':
        return <FileText className="h-20 w-20 text-red-500" />
      case 'excel':
        return <FileText className="h-20 w-20 text-green-500" />
      default:
        return <FileText className="h-20 w-20" />
    }
  }

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

      <div className="border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <span className="text-lg">+</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Name"
            className="h-8 w-32"
          />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        {viewType === 'list' ? (
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableCell className="w-12">
                    <Checkbox
                      checked={selectedFiles.length === files.length}
                      onCheckedChange={toggleAll}
                    />
                  </TableCell>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-32">Size</TableHead>
                  <TableHead className="w-48">Modified</TableHead>
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
                    <TableCell>{file.size || file.items}</TableCell>
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
          <div className="py-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedFiles.length === files.length}
                  onCheckedChange={toggleAll}
                />
                <span className="text-sm text-muted-foreground">Select all</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{files.length} items</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {files.map((file) => (
                <Card key={file.id} className="group relative">
                  <CardContent className="p-4">
                    <div className={`absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity ${selectedFiles.includes(file.id)?'opacity-100':'opacity-0'}`}>
                      <Checkbox
                        checked={selectedFiles.includes(file.id)}
                        onCheckedChange={() => toggleFile(file.id)}
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      {getFileThumbnail(file.type)}
                      <div className="mt-2 text-center">
                        <div className="text-sm font-medium truncate max-w-[150px]">{file.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {file.size || file.items}
                        </div>
                      </div>
                    </div>
                    <div className={`absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${file.isFavorite?'opacity-100':'opacity-0'}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Star className={`h-4 w-4 ${file.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}