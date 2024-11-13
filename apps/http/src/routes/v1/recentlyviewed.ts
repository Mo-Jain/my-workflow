import { Router} from "express";
import { middleware } from "../../middleware";
import client from "@repo/db/client";
import { createRecentlyViewedSchema } from "../../types";

export const recentlyViewedRouter = Router();


recentlyViewedRouter.get("/",middleware, async (req, res) => {
    
    try {
        const recentlyViewed = await client.recentlyViewed.findMany({
            where: {
                userId: req.userId
            },
            include :{
                file:true
            }
        })

        if (!recentlyViewed) {
            res.status(404).json({ message: "Recently viewed folder not found" });
            return;
        }


        function getFilePath(path: string) {
            const pathArray = path.split('/');
            return pathArray[pathArray.length - 1];
        }

        const recentlyViewedFiles = recentlyViewed.map( item => ({
            id: item.file.id,
            name: item.file.name,
            type: item.file.type,
            location: getFilePath(item.file.path),
            isFavorite: item.file.isFavorite,
            lastAccessed: item.lastViewedAt,
            size: item.file.size,
            created: item.file.createdAt
        }));


        res.json({
            recentlyViewedFiles
        })
    } catch (e) {
        res.status(400).json({ message: "Internal server error" })
    }

})

recentlyViewedRouter.post("/", middleware, async (req, res) => {
    
    const parsedData = createRecentlyViewedSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "Wrong recently viewed input format" })
        return
    }
    try {
        const file = await client.file.findFirst({
            where: {
                id: parsedData.data.fileId
            }
        })

        if (!file) {
            res.status(404).json({ message: "File not found" })
            return
        }

        const existingRecentlyViewed = await client.recentlyViewed.findFirst({
            where: {
                fileId: parsedData.data.fileId
            }
        })

        let recentlyViewedFiles = {}
        if(existingRecentlyViewed){
            recentlyViewedFiles = await client.recentlyViewed.update({
                where:{
                    id: existingRecentlyViewed.id
                },
                data: {
                    lastViewedAt: new Date()
                    }
            })
        }
        else{
            recentlyViewedFiles = await client.recentlyViewed.create({
                data: {
                    fileId: parsedData.data.fileId,
                    userId: req.userId!,
                    lastViewedAt: new Date()
                }
            })
        }
        
        res.json({
            message: "File added to recently viewed list",
            recentlyViewedFiles
        })
    } catch (e) {
        res.status(400).json({ message: "Internal server error" })
    }
})

