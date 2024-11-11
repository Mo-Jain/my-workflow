import { Star, Copy, Clipboard } from "lucide-react";
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

interface FileManagerProps {
  headers: string[];
  items: any[]; // Define items more specifically if possible
  setItems: React.Dispatch<React.SetStateAction<any[]>>; // Update the type here
  toggleFavorite?: (id: number) => void;
  hasSelect: boolean;
  iconOne?: (item: any) => JSX.Element;
  iconTwo?: (item: any) => JSX.Element;
  copySelectedItems?: () => void;
  pasteItems?: () => void;
  clipboardRef?: any;
  toggleAll: (checked: boolean) => void;
  toggleItem: (itemId: number,checked: boolean) => void;
  selectedItems: number[];
}

export default function FileManager({
  headers,
  items,
  setItems,
  toggleFavorite,
  hasSelect,
  iconOne,
  iconTwo,
  copySelectedItems,
  pasteItems,
  clipboardRef,
  toggleAll,
  toggleItem,
  selectedItems,
}: FileManagerProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });
   // Memoize the items mapped to their IDs
  const selectedItemsSet = useMemo(() => new Set(selectedItems), [selectedItems]);
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

  return (
    <div>
      <div className="w-full">
        <div className="mb-4 flex justify-end space-x-2">
          {copySelectedItems && (
            <Button onClick={copySelectedItems} disabled={selectedItems.length === 0}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          )}
          {pasteItems && (
            <Button onClick={pasteItems} disabled={!clipboardRef.current}>
              <Clipboard className="mr-2 h-4 w-4" />
              Paste
            </Button>
          )}
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                {hasSelect && (
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
                {toggleFavorite && <TableHead className="w-12"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                {items.map((item) => (
                  <SortableItem key={item.id} id={item.id}>
                    {hasSelect && (
                      <TableCell>
                        <Checkbox
                          checked={selectedItemsSet.has(item.id)}
                          onCheckedChange={(checked) => toggleItem(item.id, checked as boolean)}
                        />
                      </TableCell>
                    )}
                    {Object.entries(item)
                      .filter(([key]) => key !== "id" && key !== "type")
                      .map(([key, value], index) => (
                        <TableCell key={key} className="items-center gap-2">
                          <div className="flex items-center gap-2">
                            {index === 0 && iconOne && <div className="flex gap-2">{iconOne(item)}</div>}
                            {index === 1 && iconTwo && <div>{iconTwo(item)}</div>}
                            {item[key]}
                          </div>
                        </TableCell>
                      ))}
                    {toggleFavorite && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleFavorite(item.id)}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              item.isFavorite ? "fill-yellow-400 text-yellow-400" : ""
                            }`}
                          />
                        </Button>
                      </TableCell>
                    )}
                  </SortableItem>
                ))}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      </div>
    </div>
  );
}
