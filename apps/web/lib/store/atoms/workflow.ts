import { atom } from "recoil";

interface Item {
    id: string,
    status: string,
    durDate: Date,
    type: string,
    workflowName: string,
    currentStep: string,
    assignedTo: string,
    startDate: Date
  }
  
export const workflowState = atom<{isLoading:boolean,items: Item[] }>({
  key: "workflowState",
  default: {
    isLoading: false,
    items: []
  }
})