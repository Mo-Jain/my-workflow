import { Router} from "express";
import { middleware } from "../../middleware";
import client from "@repo/db/client";
import { createRecentlyViewedSchema } from "../../types";

export const recentlyViewedRouter = Router();


recentlyViewedRouter.get("/",middleware, async (req, res) => {
    
    try {
        const recentlyViewed = await client.folder.findFirst({
            where: {
                parentFolderId: null,
                name:"recently_viewed",
                creatorId: req.userId
            },
            include: {
                files: true
            }
        })

        if (!recentlyViewed) {
            res.status(404).json({ message: "Recently viewed folder not found" });
            return;
        }

        console.log("recently viewed : ", recentlyViewed);

        function getFilePath(path: string) {
            const pathArray = path.split('/');
            return pathArray[pathArray.length - 1];
        }

        const recentlyViewedFiles = recentlyViewed.files.map((file:any) => ({
            id: file.id,
            name: file.name,
            type: file.type,
            location: getFilePath(file.path),
            isFavorite: file.isFavorite,
            lastAccessed: file.updatedAt,
            size: file.size,
            created: file.updatedAt
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

        const recentlyViewedFiles = await client.recentlyViewed.create({
            data: {
                fileId: parsedData.data.fileId,
                userId: req.userId!,
                lastViewedAt: new Date()
            }
        })

        
        res.json({
            message: "File added to recently viewed list",
            recentlyViewedFiles
        })
    } catch (e) {
        res.status(400).json({ message: "Internal server error" })
    }
})

