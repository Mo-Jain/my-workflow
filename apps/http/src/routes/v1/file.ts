
import { Router} from "express";
import { middleware } from "../../middleware";
import client from "@repo/db/client";
import { formatItem } from ".";
import { deleteFileSchema, createFileSchema, updateFileSchema } from "../../types";

export const fileRouter = Router();   


fileRouter.post("/", middleware, async (req, res) => {
    const parsedData = createFileSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong file input format"})
        return
    }

    try {
        const parentFolder = await client.folder.findFirst({
            where: {
                id: parsedData.data.parentFolderId,
            }
        });

        if(parentFolder?.creatorId != req.userId){
            res.status(403).json({message: "Not Authorized to create"})
            return
        }
    
        await client.file.create({
            data: {
                name: parsedData.data.name,
                creatorId: req.userId!,
                parentFolderId: parsedData.data.parentFolderId,
                path: parentFolder?.path + "/" + parentFolder?.name,
                size: parsedData.data.size,
                type: parsedData.data.type,
                createdAt: parsedData.data.modifiedAt
            }
        })

        res.json({
            message: "Folders created"
        })
    } catch(e) {    
        res.status(400).json({message: "Folder not found"})
    }
})

fileRouter.get("/:fileId", middleware, async (req, res) => {
    try{
        const file = await client.file.findFirst({
            where: {
                id: req.params.folderId
            }
        })
        if (!file) {
            res.status(404).json({ message: "Folder not found" });
            return;
        }
       
        res.json({
            id: file.id,
            name: file.name,
            type: file.type,
            size: file.size,
            modfied: file.createdAt,
            path: file.path,
            createdBy: file.creatorId,
        })
    }
    catch(e){
        res.status(400).json({message: "No such file"})
    }
})


fileRouter.put("/:fileId", middleware, async (req, res) => {
    const parsedData = updateFileSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong file input format for update"})
        return
    }

    try {
        const file = await client.file.findFirst({
            where: {
                id: req.params.fileId
            }
        });

        if(file?.creatorId != req.userId){
            res.status(403).json({message: "Not Authorized to update"})
            return
        }

        await client.folder.update({
            where: {
                id: req.params.id
            }, 
            data: {
                name: parsedData.data.name,
                isFavorite: parsedData.data.isFavorite ?? file?.isFavorite
            }
        })


        res.json({message: "File updated successfully"})
    } catch(e) {    
        res.status(400).json({message: "File not found"})
    }
})

fileRouter.delete("/:fileId", middleware, async (req, res, next) => {
    const parsedData = deleteFileSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong folder input format"})
        return  
    }

    try {
        const file = await client.file.findFirst({
            where: {
                id: parsedData.data.id
            }
        })
        
        if(file?.creatorId != req.userId){
            res.status(403).json({message: "Not Authorized to delete"})
            return
        }

        await client.file.delete({
            where: {
                id: parsedData.data.id
            }
        })
        
        res.json({message: "File deleted successfully"})  
    }
    catch(e) {  
        res.status(400).json({message: "File not found"})
    }
})

