import { Router} from "express";
import { middleware } from "../../middleware";
import client from "@repo/db/src";
import { deleteFolderSchema, folderSchema, updateFolderSchema } from "../../types";

export const folderRouter = Router();   

folderRouter.get("/user",middleware, async (req, res) => {

    const user = await client.user.findFirst({
        where: {
            id: req.userId
        },
        include: {
            folders: {
                include: {
                    subfolders: true,
                    Favorite: true
                }
            }
        }
    })

    if(!user){
        res.status(403).json({message: "User not found"})
        return;
    }
    const userFolder = user?.folders.map((folder:any)=>({
                            id: folder.id,
                            name: folder.name,
                            items: folder.subfolders.length,
                            modified: folder.createdAt,
                            isFavorite: folder.Favorite.some((fav:any) => fav.id === user?.id)
                        }))
    res.json({
        userFolder
    })
})

folderRouter.post("/", middleware, async (req, res) => {
    const parsedData = folderSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong folder input format"})
        return
    }
    const folder = await client.folder.findFirst({
        where: {
            id: parsedData.data.parentFolderId
        }
    });

    if(folder?.userId != req.userId){
        res.status(403).json({message: "Not Authorized to create"})
        return
    }
 
    await client.folder.create({
        data: {
            name: parsedData.data.name,
            userId: req.userId!,
            parentFolderId: parsedData.data.parentFolderId,
            enterpriseId: parsedData.data.enterpriseId ?? null
        }
    })

    res.json({
        message: "Folders created"
    })
})


folderRouter.put("/:id", middleware, async (req, res) => {
    const parsedData = updateFolderSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong folder input format"})
        return
    }
    const folder = await client.folder.findFirst({
        where: {
            id: req.params.id
        }
    });

    if(folder?.userId != req.userId){
        res.status(403).json({message: "Not Authorized to update"})
        return
    }

    await client.folder.update({
        where: {
            id: req.params.id
        }, 
        data: {
            name: parsedData.data.name
        }
    })

    if (!folder) {  
        res.status(404).json({ message: "Folder not found" }) 
        return  
    }

    res.json({message: "Folder updated successfully"})
})

folderRouter.delete("/:id", middleware, async (req, res, next) => {
    const parsedData = deleteFolderSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong folder input format"})
        return  
    }
    const folder = await client.folder.findFirst({
        where: {
            id: parsedData.data.id
        }
    })
    if(folder?.userId != req.userId){
        res.status(403).json({message: "Not Authorized to delete"})
        return
    }
    await client.folder.delete({
        where: {
            id: parsedData.data.id
        }
    })
    
    res.json({message: "Folder deleted successfully"})  
})

