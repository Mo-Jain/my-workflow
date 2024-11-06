import { ArrowLeft, ChevronDown, Clock, FileText, Folder, Search, Star, Timer, TimerIcon } from "lucide-react"
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
import { useRouter } from "next/router"
import { use, useEffect, useState } from "react"


// This is sample data - in a real app this would come from your backend
const itemsList = [
  {
    id: 1,
    name: "User Guides",
    type: "pdf",
    location: "Enterprise",
    isFavorite: true,
    lastAccessed: "11/03/2024 3:16 PM",
    size:"1.2 MB",
    created: "11/20/2023 2:43 PM"
  },
  {
    id: 2,
    name: "ANR-PROD-ECM-UG-ECM.pdf",
    type: "pdf",
    location: "User Guides",
    isFavorite: true,
    lastAccessed: "11/04/2024 3:53 PM",
    size:"5 MB",
    created: "10/14/2022 4:35 PM"
  }
]

interface Item {
  id: number;
  name: string;
  type: string;
  location: string;
  isFavorite: boolean;
  lastAccessed: string;
  size: string;
  created: string;
}

export default function RecentlyAccessed() {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  //sort the itemslist based on lastAccessed
  const [items, setItems] = useState<Item[]>(itemsList.sort((a,b)=>new Date(b.lastAccessed).getTime()-new Date(a.lastAccessed).getTime()));
  const router = useRouter();
  const [sortConfig, setSortConfig] = useState<{
    key: 'name' | 'size' | 'modified' | 'lastAccessed' | 'location',
    direction: 'asc' | 'desc'
  }>({ key: 'name', direction: 'asc' })

  const toggleAll = (checked: boolean) => {
    setSelectedItems(checked ? items.map(item => item.id) : [])
  }

  const toggleItem = (itemId: number) => {
    setSelectedItems(current =>
      current.includes(itemId)
        ? current.filter(id => id !== itemId)
        : [...current, itemId]
    )
  }

  useEffect(() => {
    setItems(itemsList);
  }, [itemsList]);

  //write code to toggle favorite as well as update the original itemList array
  const toggleFavorite = (itemId: number, index: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  
    // Update the original itemsList array
    const itemIndex = itemsList.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
      itemsList[itemIndex].isFavorite = !itemsList[itemIndex].isFavorite;
    }
  };


  const handleSort = (key: 'name' | 'size' | 'modified' | 'lastAccessed' | 'location') => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    })
  }

  return (
    <div className="min-h-screen"
      style={{
        backgroundColor: '#ffffff', // Light theme background color
        color: '#171717', // Light theme text color
      }}>
      <div className="border-b ">
        <div className="flex justify-between h-14 items-center gap-4 px-4">
          <Button variant="ghost" size="icon"  onClick={()=>router.push('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Clock className="h-8 w-8 fill-gray-400 text-white" />
            <h1 className="text-lg font-semibold">Recently Accessed</h1>
          </div>
          <div>

          </div>
        </div>
      </div>

      

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
                 <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer w-32"
                    onClick={() => handleSort('location')}
                  >
                    Location {sortConfig.key === 'location' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer w-32"
                    onClick={() => handleSort('lastAccessed')}
                  >
                    Last Accessed {sortConfig.key === 'lastAccessed' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer w-32"
                    onClick={() => handleSort('size')}
                  >
                    Size {sortConfig.key === 'size' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
            
                  <TableHead 
                    className="cursor-pointer w-48"
                    onClick={() => handleSort('modified')}
                  >
                    Modified {sortConfig.key === 'modified' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item,index) => (
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-red-500" />
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.lastAccessed}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>{item.created}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleFavorite(item.id,index)}
                    >
                      <Star className={`h-4 w-4 ${item.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`}  />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>To personalize the Favorites list, you can push your favorite group to the top.</p>
          <p>You can also re-order items within the groups, so that your most favorite items appear at the top of the Favorites list.</p>
        </div>
      </div>
    </div>
  )
}