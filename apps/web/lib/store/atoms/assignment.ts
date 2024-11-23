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
    creatorId: string,
    currentApproval?: Approval
  }

interface Approval {
    approvalId: string,
    step: string,
    parentApprovalId?: string,
    parentApprovalName?: string,
    parentApprovalComments?: string,
    parentApprovalStatus?: string,
}

export const assignmentState = atom<{isLoading:boolean,items: Item[] }>({
  key: "assignmentState",
  default: {
    isLoading: false,
    items: []
  }
})