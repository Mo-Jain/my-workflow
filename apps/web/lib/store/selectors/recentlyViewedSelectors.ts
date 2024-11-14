import { selector } from "recoil";
import { recentlyViewedState } from "../atoms/recentlyViewed";


export const recentlyViewedItems = selector({
    key: 'recentlyViewedItems',
    get: ({ get }) => {
        const { items } = get(recentlyViewedState);
        return items;
    }
});

export const recentlyViewedIsLoading = selector({
    key: 'recentlyViewedIsLoading',
    get: ({ get }) => {
        const item = get(recentlyViewedState);
        return item.isLoading;
    },
    set: ({ set }, newValue) => {
        set(recentlyViewedState, (current) => ({
            ...current,
            isLoading: Boolean(newValue),
        }));
    },
});





