'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, ChevronDown, Star } from 'lucide-react'

interface Folder {
  id: string
  name: string
  creatorName: string
  creatorId: string
  parentFolderId: string
  parentFolderName: string
  createdAt: string
  path: string
  isFavorite: boolean
}

const initialFolders: Folder[] = [
  {
    id: "1",
    name: "Documents",
    creatorName: "John Doe",
    creatorId: "user1",
    parentFolderId: "0",
    parentFolderName: "Root",
    createdAt: "2023-01-15T10:30:00Z",
    path: "/Documents",
    isFavorite: false
  },
  {
    id: "2",
    name: "Projects",
    creatorName: "Jane Smith",
    creatorId: "user2",
    parentFolderId: "0",
    parentFolderName: "Root",
    createdAt: "2023-02-20T14:45:00Z",
    path: "/Projects",
    isFavorite: true
  },
  {
    id: "3",
    name: "Images",
    creatorName: "Alice Johnson",
    creatorId: "user3",
    parentFolderId: "0",
    parentFolderName: "Root",
    createdAt: "2023-03-10T09:15:00Z",
    path: "/Images",
    isFavorite: false
  }
]

interface FileManagerProps {
    headers: string[];
    items: any[]; // Define items more specifically if possible
    setItems: React.Dispatch<React.SetStateAction<any[]>>;
    toggleFavoriteItem?: (id: string) => void;
    toggleAll: (checked: boolean) => void;
    toggleItem: (itemId: number,checked: boolean) => void;
    selectedItems: number[];
  }
  
export default function FoldersTable({
    headers,
    items,
    setItems,
    toggleFavoriteItem,
    toggleAll,
    toggleItem,
    selectedItems,
  }: FileManagerProps) {
  const [folders, setFolders] = useState<Folder[]>(initialFolders)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderParentId, setNewFolderParentId] = useState('')

  const handleEnterpriseFolder = () => {
    console.log("Enterprise folder creation logic goes here")
  }

  const handleCreateFolder = () => {
    const newFolder: Folder = {
      id: (folders.length + 1).toString(),
      name: newFolderName,
      creatorName: "Current User", // This should be dynamically set based on the current user
      creatorId: "currentUserId", // This should be dynamically set based on the current user
      parentFolderId: newFolderParentId,
      parentFolderName: folders.find(f => f.id === newFolderParentId)?.name || "Unknown",
      createdAt: new Date().toISOString(),
      path: `/${newFolderName}`, // This is a simplified path. In reality, you'd need to construct the full path
      isFavorite: false
    }
    setFolders([...folders, newFolder])
    setIsDialogOpen(false)
    setNewFolderName('')
    setNewFolderParentId('')
  }

  const handleDeleteFolder = (folderId: string) => {
  }

  const toggleFavorite = (folderId: string) => {
    setItems(items.map(folder => 
      folder.id === folderId ? { ...folder, isFavorite: !folder.isFavorite } : folder
    ))
  }

  return (
    <div className="container mx-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
          {headers.map((header) => {
                  return (
                    <TableHead
                      key={header}
                      className="cursor-pointer items-center gap-2"
                    >
                      {header}
                      <span className="inline-block w-2">
                      </span>
                    </TableHead>
                  );
            })}
             <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
            {Object.entries(item)
            .filter(([key]) => key !== "id" && key !== "type" && key !== "isFavorite")
            .map(([key, value], index) => (
                <TableCell key={key} className="items-center gap-2">
                <div className="flex items-center gap-2">
                  <span>{item[key]}</span>
                </div>
              </TableCell>
            ))}
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(item.id)}
                  aria-label={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star className={item.isFavorite ? "fill-yellow-400" : "fill-none"} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={10}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Add Folder <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={handleEnterpriseFolder}>Enterprise</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>Other</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parentFolderId" className="text-right">
                Parent Folder ID
              </Label>
              <Input
                id="parentFolderId"
                value={newFolderParentId}
                onChange={(e) => setNewFolderParentId(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCreateFolder}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}