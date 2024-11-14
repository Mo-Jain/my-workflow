import { atom } from "recoil";

interface Item {
    id: string,
    name: string,
    location: string,
    dueDate: string,
    priority: string,
    status: string,
  }
export const assignmentState = atom<{isLoading:boolean,items: Item[] }>({
  key: "assignmentState",
  default: {
    isLoading: false,
    items: []
  }
})