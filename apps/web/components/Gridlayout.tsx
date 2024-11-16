import React from "react"
import { ChevronDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { getIcon } from "@/pages/icon/icon"
import { Card, CardContent } from "./ui/card"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableItem } from "./Sortable";
import FavoriteIcon from "./FavoriteIcon"

const GridLayout = ({ items, setItems, selectedItems, toggleItem, toggleAll }:
    { 
        items: any[]; // Define items more specifically if possible
        setItems: React.Dispatch<React.SetStateAction<any[]>>; // Update the type here 
        selectedItems: string[], 
        toggleItem: (id: string, checked: boolean) => void,
        toggleAll: (checked:boolean) => void 
    }
) => {

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const {active, over} = event

    if (active.id !== over.id) {
      setItems((items:any) => {
        const oldIndex = items.findIndex((item:any) => item.id === active.id)
        const newIndex = items.findIndex((item:any) => item.id === over.id)
        
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }
  return (
    <div>
      <div className="p-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedItems.length === items.length}
                  onCheckedChange={toggleAll}
                />
                <span className="text-sm text-muted-foreground">Select all</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{items.length} items</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {items.map((item) => (
                <Card key={item.id} className="group relative">
                  <CardContent className="p-4">
                    <div className={`absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity ${selectedItems.includes(item.id)?'opacity-100':'opacity-0'}`}>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => toggleItem(item.id, checked as boolean)}
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      {getIcon(item.type,'h-20 w-20')}
                      <div className="mt-2 text-center">
                        <div className="text-sm font-medium truncate max-w-[150px]">{item.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.size || item.items}
                        </div>
                      </div>
                    </div>
                    <div className={`absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${item.isFavorite?'opacity-100':'opacity-0'}`}>
                      <FavoriteIcon item={item} items={items} setItems={setItems}/>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
    </div>
  )
};

export default GridLayout;
