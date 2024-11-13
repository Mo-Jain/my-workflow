import React, { useRef, useState } from "react";
import { Badge, ChevronDown, FileText, Folder, LayoutGrid, LayoutList, Search, Star, Plus, Upload } from "lucide-react"
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
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios";
import { BASE_URL } from "@/next.config";


const Header = ({
                    newFolderName,
                    setNewFolderName,
                    items,
                    setItems,
                    parentFolderId
                }:
                {
                    newFolderName: string,
                    setNewFolderName: React.Dispatch<React.SetStateAction<string>>,
                    items: any[],
                    setItems: React.Dispatch<React.SetStateAction<any[]>>
                    parentFolderId: string
                }) => {

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCreateFolder = async () => {
      let uniqueFolderName = newFolderName.trim();
      let counter = 1;
      if (newFolderName.trim()) {
        // Check if the folder name exists and keep updating until a unique name is found
        while (items.some(item => item.name === uniqueFolderName)) {
          uniqueFolderName = `${newFolderName.trim()}(${counter})`;
          counter++;
        }
        
        try {
          const payload = {
                name: uniqueFolderName,
                parentFolderId: parentFolderId,
                parentFolderName: "personal_workspace"
            }
          const res = await axios.post(`${BASE_URL}/api/v1/folder`, payload, {
              headers: {
                  "Content-type": "application/json",
                  "Authorization": `Bearer ${localStorage.getItem("token")}`
              }
          });
            const newFolder = {
              id: res.data.id,
              name: uniqueFolderName,
              type: "folder",
              items: "0 items",
              modifiedAt: new Date().toLocaleString(),
              isFavorite: false
            }
            setItems([...items, newFolder])
  
            setTimeout(() => {
              toast({
                title: `Item created`,
                description: `Successfully created ${res.data.id}`,
                className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal"
              })
            }, 1000)
        }
        catch (error) {
          setTimeout(() => {
            toast({
              title: "Error",
              description: `Could not create item `,
              className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
              variant: "destructive",
            })
          }, 1000)
        }
        setNewFolderName('new folder')
      }
    }
  
    const handleFileUpload = async(event: React.ChangeEvent<HTMLInputElement>) => {
      const file : globalThis.File | undefined = event.target.files?.[0];
     
      if (!file) return;
  
      let uniqueFileName = file.name;
      let counter = 1;
  
      // Extract file name and extension (if it exists)
      const extensionIndex = uniqueFileName.lastIndexOf('.');
      const baseName = extensionIndex !== -1 ? uniqueFileName.slice(0, extensionIndex) : uniqueFileName;
      const extension = extensionIndex !== -1 ? uniqueFileName.slice(extensionIndex) : '';
  
      // Check if the file name exists and keep updating until a unique name is found
      while (items.some(item => item.name === uniqueFileName)) {
          uniqueFileName = `${baseName}(${counter})${extension}`;
          counter++;
      }
  
        try {
          const size = parseInt((file.size / 1024).toFixed(2));
          const payload = {
              name: uniqueFileName,
              parentFolderId: parentFolderId,
              size: (size>1024) ? `${(size/1024).toFixed(0)} MB` : `${size.toFixed(2)} KB`,
              type: file.type.split('/')[1] || 'file',
              modifiedAt: file.lastModified
            }
          const res = await axios.post(`${BASE_URL}/api/v1/file`, payload, {
              headers: {
                  "Content-type": "application/json",
                  "Authorization": `Bearer ${localStorage.getItem("token")}`
              }
          });
          const newFile = {
            id: res.data.id,
            name: uniqueFileName,
            size: (size>1024) ? `${(size/1024).toFixed(0)} MB` : `${size.toFixed(2)} KB`,
            type: file.type.split('/')[1] || 'file',
            modifiedAt: new Date(file.lastModified).toISOString(),
            isFavorite: false
          }
          setItems([...items, newFile])
          setTimeout(() => {
            toast({
              title: `Item created`,
              description: `Successfully created ${res.data.id}`,
              className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal"
            })
          },1000)
        }
        catch (error) {
          setTimeout(() => {
            toast({
              title: "Error",
              description: `Could not create item `,
              className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
              variant: "destructive",
            })
          }, 1000)
        }
    }
    

    return (
      <header>
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
            <Button type="submit" onClick={() =>{
                handleCreateFolder();
                if(newFolderName.trim()){
                    setIsDialogOpen(false)
                }
            }}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </header>
    
  )
};

export default Header;

