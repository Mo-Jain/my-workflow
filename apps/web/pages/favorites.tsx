'use client'
import { ArrowLeft, ChevronDown, FileText, Folder, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import FileManager from "@/components/FileManger"
import {getFileIcon} from "./icon/icon"
import { favoriteItems } from "@/lib/store/selectors/favoritesSelectors"
import { useRecoilValue } from "recoil"

// This is sample data - in a real app this would come from your backend
const itemsList = [
  {
    id: "1",
    name: "User Guides",
    type: "folder",
    location: "Enterprise",
    isFavorite: true
  },
  {
    id: "2",
    name: "ANR-PROD-ECM-UG-ECM.pdf",
    type: "pdf",
    location: "User Guides",
    isFavorite: true
  }
]

interface Item {
  id: string;
  name: string;
  type: string;
  location: string;
  isFavorite: boolean;
}

export default function Favorites() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>(itemsList);
  const favorites = useRecoilValue(favoriteItems);

  const toggleAll = (checked: boolean) => {
    setSelectedItems(checked ? items.map(item => item.id) : [])
  }

  const toggleItem = (itemId: string) => {
    setSelectedItems(current =>
      current.includes(itemId)
        ? current.filter(id => id !== itemId)
        : [...current, itemId]
    )
  }
  useEffect(() => {
    console.log(favorites);
    setItems(favorites);
  },[favorites])


  const router = useRouter();

  return (
    <div className="min-h-screen "
    style={{
      backgroundColor: '#ffffff', // Light theme background color
      color: '#171717', // Light theme text color
    }}>
      <div className="border-b">
        <div className="flex h-14 items-center gap-4 px-4">
          <Button variant="ghost" size="icon" onClick={()=>router.push('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <h1 className="text-lg font-semibold">Favorites</h1>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-b px-4 py-2">
        <Button variant="outline" className="h-8 gap-2">
          <span className="text-xs font-normal">Add group</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
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

      <div>
        <FileManager
          headers={["Name","Location"]}
          items={items}
          setItems={setItems}
          hasFavorite={true}
          toggleAll={toggleAll}
          toggleItem={toggleItem}
          selectedItems={selectedItems}
        />

        <div className="mt-4 text-sm text-muted-foreground">
          <p>To personalize the Favorites list, you can push your favorite group to the top.</p>
          <p>You can also re-order items within the groups, so that your most favorite items appear at the top of the Favorites list.</p>
        </div>
      </div>
    </div>
  )
}