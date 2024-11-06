import * as React from "react"
import { Badge, ChevronDown, Folder, LayoutGrid, LayoutList, Search, Star } from "lucide-react"
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

// Sample data - in a real app this would come from your backend
const folders = [
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
  const [selectedFolders, setSelectedFolders] = React.useState<number[]>([])
  const [viewType, setViewType] = React.useState<'list' | 'grid'>('list')

  const toggleAll = (checked: boolean) => {
    setSelectedFolders(checked ? folders.map(folder => folder.id) : [])
  }

  const toggleFolder = (folderId: number) => {
    setSelectedFolders(current =>
      current.includes(folderId)
        ? current.filter(id => id !== folderId)
        : [...current, folderId]
    )
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

      <div>
        {viewType === 'list' ? (
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableCell className="w-12">
                    <Checkbox
                      checked={selectedFolders.length === folders.length}
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
                {folders.map((folder) => (
                  <TableRow key={folder.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedFolders.includes(folder.id)}
                        onCheckedChange={() => toggleFolder(folder.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4 text-orange-400" />
                        {folder.name}
                      </div>
                    </TableCell>
                    <TableCell>{folder.items}</TableCell>
                    <TableCell>{folder.modified}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Star className={`h-4 w-4 ${folder.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedFolders.length === folders.length}
                  onCheckedChange={toggleAll}
                />
                <span className="text-sm text-muted-foreground">Select all</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{folders.length} items</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {folders.map((folder) => (
                <Card key={folder.id} className="group relative">
                  <CardContent className="p-4">
                    <div className="absolute top-2 left-2">
                      <Checkbox
                        checked={selectedFolders.includes(folder.id)}
                        onCheckedChange={() => toggleFolder(folder.id)}
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <Folder className="h-20 w-20 text-orange-400" />
                      <div className="mt-2 text-center">
                        <div className="text-sm font-medium truncate max-w-[150px]">{folder.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {folder.items}
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Star className={`h-4 w-4 ${folder.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
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