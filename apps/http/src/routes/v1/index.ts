
import { Router } from "express";
import jwt from "jsonwebtoken";

import { JWT_PASSWORD } from "../../config";
import { SigninSchema, SignupSchema } from "../../types";
import {hash, compare} from "../../scrypt";
import client from "@repo/db/client";
import { middleware } from "../../middleware";
import { folderRouter } from "./folder";
import { fileRouter } from "./file";
import { favoritesRouter } from "./favorites";
import { recentlyViewedRouter } from "./recentlyviewed";
import { assignmentRouter } from "./assignment";
import { workflowRouter } from "./workflow";

export const router = Router();

export const formatItem = (item: any, isFolder: boolean) => ({
    id: item.id,
    name: item.name,
    type: isFolder ? "folder" : item.type,
    items: isFolder ? item.subfolders.length + item.files.length : undefined,
    size: !isFolder ? item.size : undefined,
    modified: item.createdAt,
    isFavorite: item.isFavorite
});

router.post("/enterprise", middleware, async (req, res) => {
    try
    {
        await client.folder.create({
            data: {
                name: "enterpise",
                creatorId: req.userId!,
                parentFolderId: null,
                path: "root"
            }
        })

        res.json({
            message: "Enterprise Folder created successfully"
        })      
    }
    catch(e)
    {
        res.status(400).json({message: "Internal server error"})
    }
})

router.post("/signup", async (req, res) => {
    console.log("inside signup")
    // check the user
    const parsedData = SignupSchema.safeParse(req.body)
    if (!parsedData.success) {
        console.log("parsed data incorrect")
        res.status(400).json({message: "Validation failed"})
        return
    }

    const hashedPassword = await hash(parsedData.data.password)

    try {
        const user = await client.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword
            }
        })

        await client.folder.create({
            data: {
                name: "personal_workspace",
                creatorId: user.id,
                parentFolderId: null,
                path: "root"
            }
        })

        const token = jwt.sign({
            userId: user.id,
        }, JWT_PASSWORD);

        res.json({
            message:"User created successfully",
            token
        })
    } catch(e) {
        console.log("error thrown")
        console.log(e)
        res.status(400).json({message: "User already exists"})
    }
})

router.post("/signin", async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(403).json({message: "Validation failed"})
        return
    }

    try {
        const user = await client.user.findUnique({
            where: {
                username: parsedData.data.username
            }
        })
        
        if (!user) {
            res.status(403).json({message: "User not found"})
            return
        }
        const isValid = await compare(parsedData.data.password, user.password)

        if (!isValid) {
            res.status(403).json({message: "Invalid password"})
            return
        }

        const token = jwt.sign({
            userId: user.id,
        }, JWT_PASSWORD);

        res.json({
            message:"User signed in successfully",
            token
        })
    } catch(e) {
        res.status(400).json({message: "Internal server error"})
    }
})


router.get("/enterprise",middleware, async (req, res) => {
    const enterprise = await client.folder.findFirst({
        where: {
            parentFolderId: null,
            name:"enterprise",
        },
        include: {
            subfolders: {
                include: {
                    subfolders: true,
                    files: true
                }
            }
        }
    })

    if (!enterprise) {
        res.status(404).json({ message: "Enterprise folder not found" });
        return;
    }

    const enterpriseFolder = enterprise.subfolders.map((folder:any)=>formatItem(folder, true));
    
    res.json({
        enterpriseFolder
    })
})

router.get("/personal",middleware, async (req, res) => {
    const personalWorkspace = await client.folder.findFirst({
        where: {
            parentFolderId: null,
            name: "personal_workspace",
            creatorId: req.userId
        },
        include: {
            files: true,
            subfolders: {
                include: {
                    subfolders: true,
                    files: true
                }
            }
        }
    });

    if (!personalWorkspace) {
        res.status(404).json({ message: "Favorites folder not found" });
        return;
    }

    const personalFolder = personalWorkspace.subfolders.map((folder: any) => formatItem(folder, true));
    const personalFiles = personalWorkspace.files.map((file: any) => formatItem(file, false));

    res.json({
        personalFolder,
        personalFiles
    })

})



router.use("/folder", folderRouter);
router.use("/file", fileRouter);
router.use("/favorite", favoritesRouter);
router.use("/recentlyviewed", recentlyViewedRouter);
router.use("/assignment", assignmentRouter);
router.use("/workflow", workflowRouter);

