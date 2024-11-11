'use client'

import { useParams } from "next/navigation";
import React from "react"
import { Badge, ChevronDown, FileText, Folder, LayoutGrid, LayoutList, Search, Star, Plus, Upload } from "lucide-react"
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
import { useState, useRef, useCallback } from "react"
import FileManager from "@/components/FileManger"
import GridLayout from "@/components/Gridlayout"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast"
import { getFileIcon } from "../icon/icon";

const filesList = [
    
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
    id: number,
    name: string,
    type: string,
    items?: string,
    size?: string,
    modified: string,
    isFavorite: boolean
  }

const folderId = () => {
  const folderId = useParams()?.folderId;
  const [selectedFiles, setSelectedFiles] = useState<number[]>([])
  const [viewType, setViewType] = useState<'list' | 'grid'>('list')
  const [files, setFiles] = useState<File[]>(filesList)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('new folder')
  const fileInputRef = useRef<HTMLInputElement>(null);
  const clipboardRef = useRef<any>(null);


  const toggleAll = (checked: boolean) => {
    setSelectedFiles(checked ? files.map(file => file.id) : [])
  }


  const toggleFile = useCallback((itemId: number, checked: boolean) => {
    setSelectedFiles(current => {
      return checked
        ? [...current, itemId]
        : current.filter((id) => id !== itemId);
    });
  }, []);

  const toggleFavorite = (fileId: number) => {
    setFiles(prevFiles =>
      prevFiles.map(file =>
        file.id === fileId ? { ...file, isFavorite: !file.isFavorite } : file
      )
    )
  
    // Update the original itemsList array
    const fileIndex = filesList.findIndex(file => file.id === fileId)
    if (fileIndex > -1) {
      filesList[fileIndex].isFavorite = !filesList[fileIndex].isFavorite
    }
  }

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: File = {
        id: files.length + 1,
        name: newFolderName.trim(),
        type: "folder",
        items: "0 items",
        modified: new Date().toLocaleString(),
        isFavorite: false
      }
      setFiles([...files, newFolder])
      setNewFolderName('')
      setIsDialogOpen(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const size = parseInt((file.size / 1024).toFixed(2));
      const newFile: File = {
        id: files.length + 1,
        name: file.name,
        type: file.type.split('/')[1] || 'file',
        size: (size>1024) ? `${(size/1024).toFixed(0)} MB` : `${size.toFixed(2)} KB`,
        modified: new Date().toLocaleString(),
        isFavorite: false
      }
      setFiles([...files, newFile])
    }
  }

  const copySelectedItems = () => {
    const itemsToCopy = files.filter((item) => selectedFiles.includes(item.id))
    clipboardRef.current = itemsToCopy
    toast({
      title: "Items copied",
      description: `${itemsToCopy.length} item(s) copied to clipboard`,
      className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal"
    })
  }

  const pasteItems = () => {
    if (clipboardRef.current) {
      const newItems = [...files, ...clipboardRef.current.map((item: any) => ({...item, id: Date.now() + Math.random()}))]
      setFiles(newItems)
      toast({
        title: "Items pasted",
        description: `${clipboardRef.current.length} item(s) pasted`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal"
      })
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
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({title:"clicked",description:"clicked"})}>
            <ChevronDown  className="h-4 w-4" />
          </Button>
          {/* Create folder or upload file */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add new item</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>
                <Folder className="mr-2 h-4 w-4" />
                <span>New Folder</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                <span>Upload File</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            aria-label="Upload file"
          />
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for the new folder.
            </DialogDescription>
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
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCreateFolder}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div>
        {viewType === 'list' ? (
          <FileManager
            headers={["Name","Size","Modified"]}
            items={files.map(({ isFavorite, ...rest }) => rest)}
            setItems={setFiles}
            toggleFavorite={toggleFavorite}
            hasSelect={true}
            iconOne={(file) => getFileIcon(file.type)}
            copySelectedItems={copySelectedItems}
            pasteItems={pasteItems}
            clipboardRef={clipboardRef}
            toggleItem={toggleFile}
            toggleAll={toggleAll}
            selectedItems={selectedFiles}
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
