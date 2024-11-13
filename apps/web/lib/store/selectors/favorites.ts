import { selector } from "recoil";
import { favoritesState } from "../atoms/favorites";


export const favoriteItems = selector({
    key: 'favoriteItemName',
    get: ({get})=>{
        const favorites = get(favoritesState);

        return favorites.favorites;
    }
})

export const favoriteIsLoading = selector({
    key: 'favoriteIsLoading',
    get: ({get})=>{
        const favorites = get(favoritesState);

        return favorites.isLoading;
    }
})





