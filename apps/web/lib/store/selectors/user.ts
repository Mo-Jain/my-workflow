import { selector } from "recoil";
import { userState } from "../atoms/user";

export const isUserLoading = selector({
    key:"isUserLoading",
    get: ({get})=> {
        const user = get(userState);

        return user.isLoading;
    }
});

export const userNameState = selector({
    key:'userName',
    get: ({get})=>{
        const user = get(userState);

        return user.name;
    }
})