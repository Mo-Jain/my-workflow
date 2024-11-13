import { ArrowLeft, ChevronDown, Clock, FileText, Folder, Search, Star, Timer, TimerIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/router"
import {  useCallback, useEffect, useState } from "react"
import FileManager from "@/components/FileManger"
import {getFileIcon} from "./icon/icon"


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
  const [items, setItems] = useState<Item[]>(itemsList.sort((a,b)=>new Date(b.lastAccessed).getTime()-new Date(a.lastAccessed).getTime()));
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<number[]>([])

  useEffect(() => {
    setItems(itemsList);
  }, [itemsList]);

  //write code to toggle favorite as well as update the original itemList array
  const toggleFavorite = (itemId: number) => {
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

  const toggleAll = (checked: boolean) => {
    setSelectedFiles(checked ? items.map(file => file.id) : [])
  }


  const toggleItem = useCallback((itemId: number, checked: boolean) => {
    setSelectedFiles(current => {
      return checked
        ? [...current, itemId]
        : current.filter((id) => id !== itemId);
    });
  }, []);

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
          <div className="dummy"></div>
        </div>
      </div>
      <FileManager
        headers={["Name","Location","LastAccessed","Size","Created"]}
        items={items}
        setItems={setItems}
        toggleFavorite={toggleFavorite}
        hasSelect={true}
        iconOne={(file) =>getFileIcon(file.type)}
        toggleAll={toggleAll}
        toggleItem={toggleItem}
        selectedItems={selectedFiles}
       />

      
       <div className="mt-4 text-sm text-muted-foreground">
          <p>To personalize the Favorites list, you can push your favorite group to the top.</p>
          <p>You can also re-order items within the groups, so that your most favorite items appear at the top of the Favorites list.</p>
        </div>
    </div>
  )
}