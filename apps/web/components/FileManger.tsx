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
import { getFileIcon } from "@/pages/icon/icon";
import { favoritesState } from "@/lib/store/atoms/favorites";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Input } from "./ui/input";
import { copyItemState } from "@/lib/store/atoms/copyItem";

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

  return uniqueName;
};

interface FileManagerProps {
  headers: string[];
  items: any[]; // Define items more specifically if possible
  setItems: React.Dispatch<React.SetStateAction<any[]>>; // Update the type here
  hasFavorite: boolean;
  toggleAll?: (checked: boolean) => void;
  toggleItem?: (itemId: string,checked: boolean) => void;
  selectedItems?: string[];
  setSelectedItems?: React.Dispatch<React.SetStateAction<string[]>>;
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
  setSelectedItems,
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
  

  const toggleFavoriteItem = async (itemId: string) => {
    const item = items.find(item => item.id === itemId);
    if (!item) return;

    const { isFavorite, type, name, parentFolderName } = item;
    const updatedFavoriteStatus = !isFavorite;
    
    // Optimistically update the item in state
    setItems(items.map(i => i.id === itemId ? { ...i, isFavorite: updatedFavoriteStatus } : i));

    // Helper to update favorite state
    const updateFavoriteState = (isFavorite: boolean) => {
      setFavorite(prevFavorites => ({
        ...prevFavorites,
        favorites: isFavorite
          ? [...prevFavorites.favorites, { id: itemId, name, type, location: parentFolderName, isFavorite: updatedFavoriteStatus }]
          : prevFavorites.favorites.filter(fav => fav.id !== itemId)
      }));
    };

    try {
      const linkType = type === "folder" ? "folder" : "file";
      const endpoint = `${BASE_URL}/api/v1/${linkType}/${itemId}`;
      await axios.put(endpoint, { name, isFavorite: updatedFavoriteStatus }, {
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      updateFavoriteState(!isFavorite); // Update favorite state based on new favorite status
    } catch (error) {
      console.log(error);
      // Rollback favorite status in case of an error
      setItems(items.map(i => i.id === itemId ? { ...i, isFavorite } : i));
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
      const uniqueName = createUniqueName(editingItemName,items)
      setItems(items.map(item =>
        item.id === itemId ? { ...item, name: uniqueName } : item
      ))
      setEditingItemId(null)
      toaster("rename",itemId,false)

      try {
        const linkType = itemType === "folder" ? "folder" : "file";
        const endpoint = `${BASE_URL}/api/v1/${linkType}/${itemId}`;
        await axios.put(endpoint, { name : uniqueName }, {
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
                {selectedItems && toggleAll && setSelectedItems && (  
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
                { items.map((item) => {
                const type = item.type;
                return(
                  <SortableItem key={item.id} id={item.id} onDoubleClick={() => handleDoubleClick(item.id,item.type)}>
                    {selectedItems && toggleItem && setSelectedItems && (
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
                              <div >{getFileIcon(type,iconStyle)}</div>
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
                      {hasFavorite && <Button
                        variant="ghost"
                        size="sm"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) =>{ 
                          toggleFavoriteItem(item.id)
                        }}
                        aria-label={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        {getFileIcon('star',`${item.isFavorite ? "fill-yellow-400" : "fill-none"}`)}
                        </Button>}
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
