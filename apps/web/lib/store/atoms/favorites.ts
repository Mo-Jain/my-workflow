import { atom } from "recoil";

export interface Favorites {
    id: string;
    name: string;
    type: string;
    location: string;
    isFavorite: boolean;
  }
  
export const favoritesState = atom<{isLoading:boolean,favorites: Favorites[] }>({
  key: "favoritesState",
  default: {
    isLoading: false,
    favorites: []
  }
})