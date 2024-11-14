import { Router} from "express";
import { middleware } from "../../middleware";
import client from "@repo/db/client";
import { createFavoriteSchema, createFolderSchema } from "../../types";

export const adminRouter = Router();

adminRouter.get("/users", async (req, res) => {
    try
    {
        const users = await client.user.findMany();

        res.json({
            users
        })
    }
    catch(e)
    {
        res.status(400).json({message: "No Users found"})
    }
})

adminRouter.get("/files", async (req, res) => {
    try
    {
        const files = await client.file.findMany({
            include:{
                parentFolder:true,
                user:true
            }
        });

        const fileData = files.map(file =>({...file,userName:file.user.name,parentFolderName:file.parentFolder?.name}))

        res.json({
            fileData
        })
    }
    catch(e)
    {
        res.status(400).json({message: "No Files found"})
    }
})

adminRouter.get("/folders",async (req, res) => {
    try
    {
        const folders = await client.folder.findMany({
            include:{
                parentFolder:true,
                user:true

            }
        });

        const folderData = folders.map(folder =>({...folder,userName:folder.user?.name,parentFolderName:folder.parentFolder?.name}))

        res.json({
            folderData
        })
    }
    catch(e)
    {
        res.status(400).json({message: "No Folders found"})
    }
})

adminRouter.get("/recentlyViewed",  async (req, res) => {
    try
    {
        const recentlyViewedFiles = await client.recentlyViewed.findMany({
            include:{
                file:{
                    include:{
                        parentFolder:true
                    }
                },
                user:true
            }
        });

        const recentlyViewedData = recentlyViewedFiles.map((recentlyViewed) =>({
            id:recentlyViewed.id,
            fileName:recentlyViewed.file.name,
            fileId:recentlyViewed.file.id,
            userId:recentlyViewed.user.id,
            userName:recentlyViewed.user.name,
            parentFolderId:recentlyViewed.file.parentFolderId,
            parentFolderName:recentlyViewed.file.parentFolder?.name,
            path:recentlyViewed.file.path
        }))

        res.json({
            recentlyViewedData
        })
    }
    catch(e)
    {
        res.status(400).json({message: "No Recently Viewed found"})
    }
})

adminRouter.get("/assignments", async (req, res) => {
    try
    {
        const assignments = await client.assignment.findMany({
            include:{
                user:true
            }
        });

        const assignmentData = assignments.map(assignment =>({...assignment,userName:assignment.user.name}))

        res.json({
            assignmentData,
        })
    }
    catch(e)
    {
        res.status(400).json({message: "No Assignments found"})
    }
})

adminRouter.get("/workflows",  async (req, res) => {
    try
    {
        const workflows = await client.workflows.findMany({
            include:{
                user:true
            }
        });

        const workflowData = workflows.map(workflow =>({...workflow,userName:workflow.user.name}))

        res.json({
            workflowData
        })
    }
    catch(e)
    {
        res.status(400).json({message: "No Workflows found"})
    }
})


//write delete route for all the above routes without including middleware
adminRouter.delete("/users/:id",  async (req, res) => {
    try
    {
        const user = await client.user.delete({
                where:{
                    id:req.params.id
                }
            });
        res.json({
            message:"User deleted successfully",
            user
        })
    }
    catch(e)
    {
        res.status(400).json({message: "User not found"})
    }
})

adminRouter.delete("/files/:id",  async (req, res) => {
    try
    {
        const files = await client.file.delete({
            where:{
                id:req.params.id
            }
        });
        res.json({
            message:"File deleted successfully",
            files
        })
    }
    catch(e)
    {
        res.status(400).json({message: "File not found"})
    }
})

adminRouter.delete("/folders/:id",  async (req, res) => {
    try
    {
        const folders = await client.folder.delete({
            where:{
                id:req.params.id
            }
        });
        res.json({
            message:"Folder deleted successfully",
            folders
        })
    }
    catch(e)
    {
        res.status(400).json({message: "Folder not found"})
    }
})

adminRouter.delete("/recentlyViewed/:id",  async (req, res) => {
    try
    {
        const recentlyViewed = await client.recentlyViewed.delete({
            where:{
                id:req.params.id
            }
        });
        res.json({
            message:"Recently Viewed deleted successfully",
            recentlyViewed
        })
    }
    catch(e)
    {
        res.status(400).json({message: "Recently Viewed not found"})
    }
})

adminRouter.delete("/assignments/:id",  async (req, res) => {
    try
    {
        const assignments = await client.assignment.delete({
            where:{
                id:req.params.id
            }
        });
        res.json({
            message:"Assignment deleted successfully",
            assignments
        })
    }
    catch(e)
    {
        res.status(400).json({message: "Assignment not found"})
    }
})

adminRouter.delete("/workflows/:id",  async (req, res) => {
    try
    {
        const workflows =await client.workflows.delete({
            where:{
                id:req.params.id
            }
        });
        res.json({
            message:"Workflow deleted successfully",
            workflows
        })
    }
    catch(e)
    {
        res.status(400).json({message: "Workflow not found"})
    }
})

adminRouter.post("/enterprise",async (req, res) => {
    try
    {
            
        let message = "Folder created successfully"
        const folder = await client.folder.create({
            data: {
                name: "enterprise",
                creatorId: req.userId!,
                parentFolderId: null,
                path:  "root"
            }
        })
        res.json({
            message,
            id: folder.id
        })
    }
    catch(e)
    {
        res.status(400).json({message: "Folder already exists"})
    }
})

adminRouter.post("/folder",middleware,async (req, res) => {
    try
    {
        const parsedData = createFolderSchema.safeParse(req.body)
        if (!parsedData.success) {
            res.status(400).json({message: "Wrong folder input format"})
            return
        }
        
        console.log("inside the folder")
        
        
        console.log("above parnet folder")
        let parentFolder = null;
        if(parsedData.data.parentFolderId==""){
            createFolder(parsedData.data.name,parentFolder)
            return
        }
        parentFolder = await client.folder.findFirst({
            where: {
                id: parsedData.data.parentFolderId ?? null
            }
        });

        if(!parentFolder){
            res.status(403).json({message: "parent folder not found"})
            return
        }

        createFolder(parsedData.data.name,parentFolder);
        return;

        async function createFolder(name:string,parentFolder:any | null){
                                   
            let message = "Folder created successfully"
            const folder = await client.folder.create({
                data: {
                    name: name,
                    creatorId: req.userId,
                    parentFolderId: parentFolder ? parentFolder.id : null ,
                    path: (parentFolder ? parentFolder?.name : "root")+ "/" + name 
                }
            })
            res.json({
                message,
                id: folder.id,
                creatorId: req.userId,
                creatorName: req.name,
                parentFolderId: parentFolder ? parentFolder.id : null ,
                parentFolderName: parentFolder ?  parentFolder.name : "root",
                path: (parentFolder ? parentFolder?.name : "root")+ "/" + name
            })
        }
        
    }
    catch(e)
    {
        res.status(400).json({message: "Folder already exists"})
    }
})



