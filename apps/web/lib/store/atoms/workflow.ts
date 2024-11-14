import { atom } from "recoil";

interface Item {
    id: string,
    status: string,
    durDate: Date,
    type: string,
    workflow: string,
    currentstep: string,
    assignedto: string,
    startdate: Date
  }
  
export const recentlyViewedState = atom<{isLoading:boolean,items: Item[] }>({
  key: "recentlyViewedState",
  default: {
    isLoading: false,
    items: []
  }
})