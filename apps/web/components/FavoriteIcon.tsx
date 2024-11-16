import { getIcon } from "@/pages/icon/icon";
import { Button } from "./ui/button";
import { BASE_URL } from "@/next.config";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { favoritesState } from "@/lib/store/atoms/favorites";

const FavoriteIcon = ({item, items, setItems}:
    { 
        item: any,
        items?: any[],
        setItems?: React.Dispatch<React.SetStateAction<any[]>>
    }
) => {
    const setFavorite = useSetRecoilState(favoritesState);

    const toggleFavoriteItem = async (itemId: string) => {
        
        if (!item) return;
    
        const { isFavorite, type, name, parentFolderName } = item;
        const updatedFavoriteStatus = !isFavorite;
        
        // Optimistically update the item in state
        if(setItems && items){
            setItems(items.map(i => i.id === itemId ? { ...i, isFavorite: updatedFavoriteStatus } : i));
        }
    
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
          if(setItems && items){
            setItems(items.map(i => i.id === itemId ? { ...i, isFavorite } : i));
          }
        }
      };
  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) =>{ 
            toggleFavoriteItem(item.id)
        }}
        aria-label={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
        {getIcon('star',`${item.isFavorite ? "fill-yellow-400" : "fill-none"}`)}
    </Button>
    </div>
  )
};

export default FavoriteIcon;
