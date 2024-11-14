import { selector } from "recoil";
import { Favorites, favoritesState } from "../atoms/favorites";


export const favoriteItems = selector({
    key: 'favoriteItems',
    get: ({ get }) => {
        const { favorites } = get(favoritesState);
        return favorites;
    }
});

export const favoriteIsLoading = selector({
    key: 'favoriteIsLoading',
    get: ({ get }) => {
        const favorites = get(favoritesState);
        return favorites.isLoading;
    },
    set: ({ set }, newValue) => {
        set(favoritesState, (current) => ({
            ...current,
            isLoading: Boolean(newValue),
        }));
    },
});





