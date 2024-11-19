import z from "zod";

export const SignupSchema = z.object({
    username: z.string(),
    password: z.string(),
    name: z.string(),
})

export const SigninSchema = z.object({
    username: z.string(),
    password: z.string(),
})

export const UpdateMetadataSchema = z.object({
    avatarId: z.string()
})

export const createFolderSchema = z.object({
    name: z.string(),
    parentFolderId: z.string(),
    parentFolderName: z.string().optional(),
})


export const deleteFolderSchema = z.object({
  id: z.string(),
})

export const updateFolderSchema = z.object({
  name: z.string(),
  isFavorite: z.boolean().optional()
})

export const createFileSchema = z.object({
  name: z.string(),
  parentFolderId: z.string(),
  size: z.string(),
  type: z.string(),
  modifiedAt: z.number  ().optional(),
})

export const deleteFileSchema = z.object({
  fileId: z.string(),
})

export const updateFileSchema = z.object({
  name: z.string(),
  isFavorite: z.boolean().optional(),
  type: z.string().optional(),
  workflowId: z.number().optional(),
})

export const createFavoriteSchema = z.object({
  name: z.string(),
  type: z.string(),
  fileId: z.string().optional(),
  folderId: z.string().optional(),
  parentFolderId: z.string(),
})

export const createRecentlyViewedSchema = z.object({
  fileId: z.string()
})
export const createWorkflowSchema = z.object({
  dueDate: z.date().optional(),
  workflowName: z.string(),
  currentStep: z.string(),
  selectedFilesId: z.array(z.string()),
  type: z.string(),
})

export const updateWorkflowSchema = z.object({
  status: z.string().optional(),
})

export const createAssignmentSchema = z.object({
  Aprovers: z.array(z.object({userId: z.string(),step:z.string()})),
})

export const updateAssignmentSchema = z.object({
  comments: z.string(),
})

export const deleteAssignmentSchema = z.object({
  userId: z.string(),
})

export const createWorkflowDataSchema = z.object({
  workflowName: z.string(),
  department: z.string(),
  companyName: z.string(),
  site: z.string(),
  referenceNumber: z.string(),
  sbu: z.string(),
  clauseNumber: z.string(),
  workflowType: z.string(),
  subject: z.string().optional(),
  to: z.string().optional(),
  project: z.string().optional(),
  remarks: z.string().optional(),
  finalApproval: z.string().optional(),
  notification: z.string().optional()
})





declare global {
    namespace Express {
      export interface Request {
        role?: "Admin" | "User";
        userId?: string;
        name?: string;
      }
    }
}