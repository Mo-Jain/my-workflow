import { atom } from "recoil";

export interface Workflow {
  id: string,
  status: string,
  dueDate: Date,
  workflowName: string,
  currentStep: string,
  assignedTo: string,
  startDate: Date,
  files: File[],
  stopDate: Date | null
}

interface File {
  id: string;
  name: string;
  path: string;
  type: string;
  creatorId: string;
  size: string;
  parentFolderId: string | null;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  workflowId: string | null;
}
  
export const workflowState = atom<{ isLoading: boolean, items: Workflow[] }>({
  key: "workflowState",
  default: {
    isLoading: false,
    items: []
  }
})