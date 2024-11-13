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
  isFavorite: z.boolean().optional()
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
})

export const updateWorkflowSchema = z.object({
  status: z.string().optional(),
  assignedTo: z.string().optional(),
})

export const createAssignmentSchema = z.object({
  name: z.string(),
  location: z.string(),
  dueDate: z.date().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
})

export const updateAssignmentSchema = z.object({
  location: z.string(),
})





declare global {
    namespace Express {
      export interface Request {
        role?: "Admin" | "User";
        userId?: string;
      }
    }
}