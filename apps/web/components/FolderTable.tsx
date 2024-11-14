'use client'

import { useState, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, ChevronDown, Star, Copy, Clipboard, Edit2 } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

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
  isFolder: boolean
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
    isFavorite: false,
    isFolder: true
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
    isFavorite: true,
    isFolder: true
  },
  {
    id: "3",
    name: "report.pdf",
    creatorName: "Alice Johnson",
    creatorId: "user3",
    parentFolderId: "1",
    parentFolderName: "Documents",
    createdAt: "2023-03-10T09:15:00Z",
    path: "/Documents/report.pdf",
    isFavorite: false,
    isFolder: false
  }
]

export default function FoldersTable() {
  const [folders, setFolders] = useState<Folder[]>(initialFolders)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderParentId, setNewFolderParentId] = useState('')
  const [selectedFolders, setSelectedFolders] = useState<string[]>([])
  const [copiedFolders, setCopiedFolders] = useState<Folder[]>([])
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [editingFolderName, setEditingFolderName] = useState('')
  const router = useRouter()

  const handleEnterpriseFolder = () => {
    console.log("Enterprise folder creation logic goes here")
  }

  const handleCreateFolder = () => {
    const newFolder: Folder = {
      id: (folders.length + 1).toString(),
      name: newFolderName,
      creatorName: "Current User",
      creatorId: "currentUserId",
      parentFolderId: newFolderParentId,
      parentFolderName: folders.find(f => f.id === newFolderParentId)?.name || "Unknown",
      createdAt: new Date().toISOString(),
      path: `/${newFolderName}`,
      isFavorite: false,
      isFolder: true
    }
    setFolders([...folders, newFolder])
    setIsDialogOpen(false)
    setNewFolderName('')
    setNewFolderParentId('')
  }

  const handleDeleteFolder = (folderId: string) => {
    setFolders(folders.filter(folder => folder.id !== folderId))
    setSelectedFolders(selectedFolders.filter(id => id !== folderId))
  }

  const toggleFavorite = (folderId: string) => {
    setFolders(folders.map(folder => 
      folder.id === folderId ? { ...folder, isFavorite: !folder.isFavorite } : folder
    ))
  }

  const toggleSelectFolder = (folderId: string) => {
    setSelectedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    )
  }

  const handleCopyFolders = () => {
    const foldersToCopy = folders.filter(folder => selectedFolders.includes(folder.id))
    setCopiedFolders(foldersToCopy)
    toast({
      title: "Folders Copied",
      description: `${foldersToCopy.length} folder(s) copied to clipboard.`
    })
  }

  const handlePasteFolders = () => {
    const newFolders = copiedFolders.map(folder => ({
      ...folder,
      id: (folders.length + 1).toString(),
      name: `${folder.name} (Copy)`,
      createdAt: new Date().toISOString()
    }))
    setFolders([...folders, ...newFolders])
    toast({
      title: "Folders Pasted",
      description: `${newFolders.length} folder(s) pasted successfully.`
    })
  }

  const handleDoubleClick = (folder: Folder) => {
    if (folder.isFolder) {
      router.push(`/${folder.id}`)
    }
  }

  const handleRenameClick = (folderId: string, folderName: string) => {
    setEditingFolderId(folderId)
    setEditingFolderName(folderName)
  }

  const handleRenameKeyDown = (e: KeyboardEvent<HTMLInputElement>, folderId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setFolders(folders.map(folder =>
        folder.id === folderId ? { ...folder, name: editingFolderName } : folder
      ))
      setEditingFolderId(null)
      toast({
        title: "Folder Renamed",
        description: "The folder has been successfully renamed."
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopyFolders}
            disabled={selectedFolders.length === 0}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePasteFolders}
            disabled={copiedFolders.length === 0}
            className="ml-2"
          >
            <Clipboard className="mr-2 h-4 w-4" />
            Paste
          </Button>
        </div>
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
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Select</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Creator Name</TableHead>
            <TableHead>Creator Id</TableHead>
            <TableHead>ParentFolderId</TableHead>
            <TableHead>ParentFolderName</TableHead>
            <TableHead>CreatedAt</TableHead>
            <TableHead>Path</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {folders.map((folder) => (
            <TableRow 
              key={folder.id} 
              onDoubleClick={() => handleDoubleClick(folder)}
              style={{ cursor: folder.isFolder ? 'pointer' : 'default' }}
            >
              <TableCell>
                <Checkbox
                  checked={selectedFolders.includes(folder.id)}
                  onCheckedChange={() => toggleSelectFolder(folder.id)}
                />
              </TableCell>
              <TableCell>
                {editingFolderId === folder.id ? (
                  <Input
                    value={editingFolderName}
                    onChange={(e) => setEditingFolderName(e.target.value)}
                    onKeyDown={(e) => handleRenameKeyDown(e, folder.id)}
                    onBlur={() => setEditingFolderId(null)}
                    autoFocus
                  />
                ) : (
                  folder.name
                )}
              </TableCell>
              <TableCell>{folder.id}</TableCell>
              <TableCell>{folder.creatorName}</TableCell>
              <TableCell>{folder.creatorId}</TableCell>
              <TableCell>{folder.parentFolderId}</TableCell>
              <TableCell>{folder.parentFolderName}</TableCell>
              <TableCell>{new Date(folder.createdAt).toLocaleString()}</TableCell>
              <TableCell>{folder.path}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => handleRenameClick(folder.id, folder.name)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleFavorite(folder.id)}>
                  <Star className={folder.isFavorite ? "fill-yellow-400" : "fill-none"} />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteFolder(folder.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
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