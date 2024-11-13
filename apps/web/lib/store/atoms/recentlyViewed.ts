import { atom } from "recoil";

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
export const recentlyViewedState = atom<{isLoading:boolean,items: Item[] }>({
  key: "recentlyViewedState",
  default: {
    isLoading: false,
    items: []
  }
})