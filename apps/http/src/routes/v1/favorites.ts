import { Router} from "express";
import { middleware } from "../../middleware";
import client from "@repo/db/client";
import { formatItem } from ".";
import { createFavoriteSchema } from "../../types";

export const favoritesRouter = Router();

favoritesRouter.get("/",middleware, async (req, res) => {
    try
    {
        const folders = await client.folder.findMany({
            where: {
                creatorId:req.userId,
                isFavorite:true
            },
            include:{
                files:true, 
                subfolders:true,
                parentFolder:true
            }
        })

        const files = await client.file.findMany({
            where: {
                creatorId:req.userId,
                isFavorite:true
            },
            include:{
                parentFolder:true
            }
        })

        if(!folders && !files){
            res.status(404).json({ message: "No favorites found" });
        }

        const favoriteFolders = folders.map((folder:any) => ({
            id: folder.id,
            name: folder.name,
            type: "folder",
            location: folder.parentFolder?.name,
            isFavorite: folder.isFavorite
        }))

        const favoriteFiles = files.map((file:any) => ({
            id: file.id,
            name: file.name,
            type: file.type,
            location: file.parentFolder?.name,
            isFavorite: file.isFavorite
        }))


        res.json({
            favoriteFolders,
            favoriteFiles
        })
    }
    catch(e)
    {
        res.status(400).json({message: "No folders or files found"})
    }
})
