import { selector } from "recoil";
import { workflowState } from "../atoms/workflow";


export const workflowItems = selector({
    key: 'workflowItems',
    get: ({ get }) => {
        const { items } = get(workflowState);
        return items;
    }
});

export const favoriteIsLoading = selector({
    key: 'favoriteIsLoading',
    get: ({ get }) => {
        const item = get(workflowState);
        return item.isLoading;
    },
    set: ({ set }, newValue) => {
        set(workflowState, (current) => ({
            ...current,
            isLoading: Boolean(newValue),
        }));
    },
});





