import { selector } from "recoil";
import { assignmentState } from "../atoms/assignment";


export const assignmentItems = selector({
    key: 'assignmentItems',
    get: ({ get }) => {
        const { items } = get(assignmentState);
        return items;
    }
});

export const favoriteIsLoading = selector({
    key: 'favoriteIsLoading',
    get: ({ get }) => {
        const item = get(assignmentState);
        return item.isLoading;
    },
    set: ({ set }, newValue) => {
        set(assignmentState, (current) => ({
            ...current,
            isLoading: Boolean(newValue),
        }));
    },
});





