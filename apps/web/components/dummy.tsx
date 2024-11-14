import { ArrowLeft, ChevronDown, Clock, FileText, Folder, Search, Star, Timer, TimerIcon } from "lucide-react"
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
import { useRouter } from "next/router"
import { use, useEffect, useState } from "react"



export default function RecentlyAccessed( 
  { headers,items,toggleFavorite,isFavorite,iconOne,iconTwo } :
  { 
    headers: string[],
    items: any[],
    toggleFavorite: (id: string,index: number) => void,
    isFavorite:boolean,
    iconOne: JSX.Element;
    iconTwo: JSX.Element;
  } 
) {

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  //sort the itemslist based on lastAccessed
  const router = useRouter();
  const [sortConfig, setSortConfig] = useState<{
    key: string,
    direction: 'asc' | 'desc'
  }>({ key: 'name', direction: 'asc' })

  const toggleAll = (checked: boolean) => {
    setSelectedItems(checked ? items.map(item => item.id) : [])
  }

  const toggleItem = (itemid: string) => {
    setSelectedItems(current =>
      current.includes(itemId)
        ? current.filter(id => id !== itemId)
        : [...current, itemId]
    )
  }


  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    })
  }

  return (
      <div>
        <div className="w-full">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow className="hover:bg-gray-0 cursor-pointer">
                <TableCell className="w-12">
                  <Checkbox
                    checked={selectedItems.length === items.length}
                    onCheckedChange={toggleAll}
                  />
                </TableCell>
                {headers.map((header) => (
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort(header.toLowerCase())}
                  >
                    {header} {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  
                )
                )}
                {isFavorite &&
                <TableHead className="w-12"></TableHead>
                }
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item,index) => {
                const keys = Object.keys(item);
                return(
                <TableRow
                    key={item.id}
                    className={`${
                    selectedItems.includes(item.id) ? "bg-gray-200" : ""
                    } hover:bg-gray-200 cursor-pointer`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => toggleItem(item.id)}
                    />
                  </TableCell>
                  
                  
                  {keys && keys.map((key,index) => (
                    <div>
                      <div>{index === 0 && 
                        <TableCell className="flex items-center gap-2">
                           {iconOne && <div>{iconOne}</div>}
                           {item[keys[index]]}
                        </TableCell>}</div>
                      <div>{index === 1 && 
                        <TableCell className="flex items-center gap-2">
                          {iconTwo && <div>{iconTwo}</div>}
                          {item[keys[index]]}
                        </TableCell>}</div>
                      <div>{index > 1 && <TableCell></TableCell>}</div>
                      <TableCell>{item[index]}</TableCell>
                    </div>
                  ))}
                  {isFavorite && 
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleFavorite(item.id,index)}
                    >
                      <Star className={`h-4 w-4 ${item.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`}  />
                    </Button>
                  </TableCell>}
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </div>
      </div>
  )
}