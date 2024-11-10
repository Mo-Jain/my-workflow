import z from "zod";

export const SignupSchema = z.object({
    username: z.string(),
    password: z.string(),
    type: z.enum(["user", "admin"]),
})

export const SigninSchema = z.object({
    username: z.string(),
    password: z.string(),
})

export const UpdateMetadataSchema = z.object({
    avatarId: z.string()
})

export const folderSchema = z.object({
    name: z.string(),
    parentFolderId: z.string(),
    enterpriseId: z.number().optional(),
})

export const deleteFolderSchema = z.object({
  id: z.string(),
  enterpriseId: z.number().optional(),
})

export const updateFolderSchema = z.object({
  name: z.string()
})


declare global {
    namespace Express {
      export interface Request {
        role?: "Admin" | "User";
        userId?: string;
      }
    }
}