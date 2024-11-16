import { Star, Copy, Clipboard, Trash, Pen, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./Sortable";
import axios from "axios";
import { BASE_URL } from "@/next.config";
import { toaster } from "@/pages/admin";
import { useRouter } from "next/router";
import { getIcon } from "@/pages/icon/icon";
import { favoritesState } from "@/lib/store/atoms/favorites";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Input } from "./ui/input";
import { copyItemState } from "@/lib/store/atoms/copyItem";
import FavoriteIcon from "./FavoriteIcon";
import e from "express";

export const createUniqueName = (name: string,items:any[]) => {
  let uniqueName = name;
  let counter = 1;

  const extensionIndex = uniqueName.lastIndexOf('.');
  const baseName = extensionIndex !== -1 ? uniqueName.slice(0, extensionIndex) : uniqueName;
  const extension = extensionIndex !== -1 ? uniqueName.slice(extensionIndex) : '';

  while (items.some(item => item.name === uniqueName)) {
      uniqueName = `${baseName}(${counter})${extension}`;
      counter++;
  }

  const type  = extension.slice(1);

  return {uniqueName,type};
};

interface FileManagerProps {
  headers: string[];
  items: any[]; // Define items more specifically if possible
  setItems: React.Dispatch<React.SetStateAction<any[]>>; // Update the type here
  hasFavorite: boolean;
  toggleAll?: (checked: boolean) => void;
  toggleItem?: (itemId: string,checked: boolean) => void;
  selectedItems?: string[];
  iconStyle?: string;
  editingItemId?:string | null;
  setEditingItemId? : React.Dispatch<React.SetStateAction<string | null>>;
  editingItemName?: string;
  setEditingItemName?: React.Dispatch<React.SetStateAction<string>>;
}

export default function FileManager({
  headers,
  items,
  setItems,
  hasFavorite,
  toggleAll,
  toggleItem,
  selectedItems,
  iconStyle,
  editingItemId,
  setEditingItemId,
  editingItemName,
  setEditingItemName
  }: FileManagerProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });
   // Memoize the items mapped to their IDs
  const router = useRouter();
  const setFavorite = useSetRecoilState(favoritesState);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSort = (key: string) => {
    // Determine the new sorting direction
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    
    // Sort items based on the key and direction
    const sortedItems = [...items].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      // Handle different data types
      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }
    });

    // Update state with sorted items and new sort configuration
    setItems(sortedItems);
    setSortConfig({ key, direction });
  };
  

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items: any[]): any[] => {
        const oldIndex = items.findIndex((item: any) => item.id === active.id);
        const newIndex = items.findIndex((item: any) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex); // Add type assertion here
      });
    }
  };
  


  const handleDoubleClick = (id:string,type:string) => {
    if(type === "folder"){
      router.push(`/node/${id}`)
    }
  }
  
  
  const handleRenameKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>, itemId: string, itemName: string, itemType: string) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if(!editingItemName || !setEditingItemId ) return;
      if(editingItemName.length === 0){
        toaster("rename",'',true)
        return
      }
      const {uniqueName,type} = createUniqueName(editingItemName,items)
      setItems(items.map(item =>
        item.id === itemId ? { ...item, name: uniqueName } : item
      ))
      setEditingItemId(null)
      toaster("rename",itemId,false)

      try {
        const linkType = itemType === "folder" ? "folder" : "file";
        const endpoint = `${BASE_URL}/api/v1/${linkType}/${itemId}`;
        await axios.put(endpoint, { name : uniqueName, type:type }, {
          headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
  
      } catch (error) {
        console.log(error);
        // Rollback favorite status in case of an error
        setItems(items.map(item =>
          item.id === itemId ? { ...item, name: itemName } : item
        ))
      }
    }
  }


  
    return (
    <div>
      <div className="w-full">
        
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                {selectedItems && toggleAll && (  
                  <TableCell className="w-12">
                    <Checkbox
                      checked={selectedItems.length === items.length}
                      onCheckedChange={(checked) => toggleAll(checked as boolean)}
                    />
                  </TableCell>
                )}
                {headers.map((header) => {
                  const isSorted = sortConfig.key === header.toLowerCase();
                  return (
                    <TableHead
                      key={header}
                      className="cursor-pointer items-center gap-2"
                      onClick={() => handleSort(header.toLowerCase())}
                    >
                      {header}
                      <span className="inline-block w-2">
                        {isSorted ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                      </span>
                    </TableHead>
                  );
                })}
                {hasFavorite && <TableHead className="w-12"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              <SortableContext items={items.map((item) => item.id)} 
              strategy={verticalListSortingStrategy}>
                { items.map((item:any) => {
                const type = item.type;
                return(
                  <SortableItem key={item.id} id={item.id} onDoubleClick={() => handleDoubleClick(item.id,item.type)}>
                    {selectedItems && toggleItem &&  (
                      <TableCell>
                        <Checkbox
                          onPointerDown={(e) => e.stopPropagation()}
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={(checked) => toggleItem(item.id, checked as boolean)}
                        />
                      </TableCell>
                    )}
                    {Object.entries(item)
                      .filter(([key]) => key !== "id" && key !== "type" && key !== "isFavorite")
                      .map(([key, value], index) => (
                        <TableCell key={key} className="items-center gap-2">
                          <div className="flex items-center gap-2">
                            {index === 0 ? (
                              <div className="flex gap-2 items-center">
                              <div >{getIcon(type,iconStyle)}</div>
                                {editingItemId === item.id && setEditingItemName && setEditingItemId ? (
                                  <Input
                                    value={editingItemName}
                                    onChange={(e) => setEditingItemName(e.target.value)}
                                    onKeyDown={(e) => handleRenameKeyDown(e, item.id, item.name, item.type)}  
                                    onBlur={() => setEditingItemId(null)}
                                    autoFocus
                                  />
                                  ) : (
                                    <span>{item[key]}</span>
                                  )}
                                </div>)
                              :
                              <span>{item[key]}</span>
                              }
                          </div>
                        </TableCell>
                      ))}
                    <TableCell>
                      <div>
                      {hasFavorite && 
                        <FavoriteIcon item={item} items={items} setItems={setItems}/>
                      }
                      </div>
                    </TableCell>
                  </SortableItem>
                )})}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      </div>
    </div>
  );
}
