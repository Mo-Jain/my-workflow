import { Router} from "express";
import { middleware } from "../../middleware";
import client from "@repo/db/client";
import { deleteFileSchema, createFileSchema, updateFileSchema } from "../../types";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { S3 } from "aws-sdk"
import { copyFileInS3, deleteObjectFromS3, generatePresignedUrl } from "../../utils/s3";



const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.S3_ENDPOINT
})

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

        const name = parsedData.data.name;
        const path = parentFolder?.path + "/" + name;
        const contentType = parsedData.data.contentType ?? "application/octet-stream";

        let signedUrl = "";

        if(parsedData.data.parentFileId){
            const parentFile = await client.file.findFirst({
                where: {
                    id: parsedData.data.parentFileId
                }
            })
            if(!parentFile){
                res.status(404).json({message: "Parent file not found"})
                return
            }
            await copyFileInS3(parentFile.creatorId+parentFile.path,req.userId+path);
        }
        else{
            signedUrl = await generatePresignedUrl(req.userId+path, contentType);
        }

        let message = "File created successfully";
        const createdDate = parsedData.data.modifiedAt ? new Date(parsedData.data.modifiedAt) : new Date();
        
        const file = await client.file.create({
            data: {
                name: name,
                creatorId: req.userId!,
                parentFolderId: parsedData.data.parentFolderId,
                path: path,
                size: parsedData.data.size,
                type: parsedData.data.type,
                createdAt: createdDate,
                contentType: contentType
            }
        })

        res.json({
            message,
            id: file.id,
            url:signedUrl
        })
    } catch(e) {    
        res.status(400).json({message: "Internal server error"})
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

        if(!file){
            res.status(404).json({message: "File not found"})
            return
        }

        if(file.creatorId != req.userId){
            res.status(403).json({message: "Not Authorized to update"})
            return
        }

        let name = parsedData.data.name;
        let message = "File updated successfully";

         await client.file.update({
            where: {
                id: req.params.fileId
            }, 
            data: {
                name: name,
                isFavorite: parsedData.data.isFavorite ?? file.isFavorite,
                type: parsedData.data.type ?? file.type,
                workflowId: parsedData.data.workflowId
            }
        })

        res.json({
            message
        })
    } catch(e) {    
        res.status(400).json({message: "File not found"})
    }
})

fileRouter.delete("/:fileId", middleware, async (req, res, next) => {
    const parsedData = deleteFileSchema.safeParse(req.params);
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong file input format for update"})
        return
    }

    try {
        const file = await client.file.findFirst({
            where: {
                id: parsedData.data.fileId
            }
        });

        
        if(file?.creatorId != req.userId){
            res.status(403).json({message: "Not Authorized to delete"})
            return
        }

        if(!file){
            res.status(404).json({message: "File not found"})
            return
        }

        await deleteObjectFromS3(req.userId+file.path);

        await client.file.delete({
            where: {
                id: parsedData.data.fileId
            }
        })
        
        res.json({message: "File deleted successfully"})  
    }
    catch(e) {  
        res.status(400).json({message: "File not found"})
    }
})

