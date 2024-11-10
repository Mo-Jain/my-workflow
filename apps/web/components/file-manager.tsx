import { Star, Copy, Clipboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState, useRef } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { toast } from "@/components/ui/use-toast"

interface FileManagerProps {
  headers: string[]
  items: any[]
  toggleFavorite?: (id: number) => void
  hasSelect: boolean
  iconOne?: (item: any) => JSX.Element
  iconTwo?: (item: any) => JSX.Element
}

export function FileManagerComponent({
  headers,
  items,
  toggleFavorite,
  hasSelect,
  iconOne,
  iconTwo,
}: FileManagerProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc"
  }>({ key: "name", direction: "asc" })
  const [fileItems, setFileItems] = useState(items)
  const clipboardRef = useRef<any>(null)

  const toggleAll = (checked: boolean) => {
    setSelectedItems(checked ? fileItems.map((item) => item.id) : [])
  }

  const toggleItem = (itemId: number) => {
    setSelectedItems((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId]
    )
  }

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    })
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }

    const items = Array.from(fileItems)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setFileItems(items)
  }

  const copySelectedItems = () => {
    const itemsToCopy = fileItems.filter((item) => selectedItems.includes(item.id))
    clipboardRef.current = itemsToCopy
    toast({
      title: "Items copied",
      description: `${itemsToCopy.length} item(s) copied to clipboard`,
    })
  }

  const pasteItems = () => {
    if (clipboardRef.current) {
      const newItems = [...fileItems, ...clipboardRef.current.map((item: any) => ({...item, id: Date.now() + Math.random()}))]
      setFileItems(newItems)
      toast({
        title: "Items pasted",
        description: `${clipboardRef.current.length} item(s) pasted`,
      })
    }
  }

  return (
    <div>
      <div className="w-full">
        <div className="mb-4 flex justify-end space-x-2">
          <Button onClick={copySelectedItems} disabled={selectedItems.length === 0}>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          <Button onClick={pasteItems} disabled={!clipboardRef.current}>
            <Clipboard className="mr-2 h-4 w-4" />
            Paste
          </Button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                {hasSelect && (
                  <TableCell className="w-12">
                    <Checkbox
                      checked={selectedItems.length === fileItems.length}
                      onCheckedChange={toggleAll}
                    />
                  </TableCell>
                )}
                {headers.map((header) => {
                  const isSorted = sortConfig.key === header.toLowerCase()
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
                  )
                })}
                {toggleFavorite && <TableHead className="w-12"></TableHead>}
              </TableRow>
            </TableHeader>
            <Droppable droppableId="file-list">
              {(provided) => (
                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                  {fileItems.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                      {(provided) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${
                            selectedItems.includes(item.id) ? "bg-gray-200" : ""
                          } hover:bg-gray-200 cursor-pointer`}
                        >
                          {hasSelect && (
                            <TableCell>
                              <Checkbox
                                checked={selectedItems.includes(item.id)}
                                onCheckedChange={() => toggleItem(item.id)}
                              />
                            </TableCell>
                          )}
                          {Object.entries(item)
                            .filter(([key]) => key !== "id" && key !== "type")
                            .map(([key, value], index) => (
                              <>
                                {index <= 1 && (
                                  <TableCell key={key} className="items-center gap-2">
                                    <div className="flex items-center gap-2">
                                      {index === 0 && iconOne && <div className="flex gap-2">{iconOne(item)}</div>}
                                      {index === 1 && iconTwo && <div>{iconTwo(item)}</div>}
                                      {item[key]}
                                    </div>
                                  </TableCell>
                                )}
                                {index > 1 && (
                                  <TableCell key={key}>
                                    {item[key]}
                                  </TableCell>
                                )}
                              </>
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
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </Table>
        </DragDropContext>
      </div>
    </div>
  )
}