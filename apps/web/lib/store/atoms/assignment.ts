import { atom } from "recoil";

export interface Item {
    id: string,
    name: string,
    location: string,
    dueDate: string,
    priority: string,
    status: string,
    from: string,
    startDate:Date,
    creatorId: string
  }
export const assignmentState = atom<{isLoading:boolean,items: Item[] }>({
  key: "assignmentState",
  default: {
    isLoading: false,
    items: []
  }
})