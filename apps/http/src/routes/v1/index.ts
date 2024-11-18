
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
import { adminRouter } from "./admin";

export const router = Router();

export const formatItem = (item: any, isFolder: boolean) => ({
    id: item.id,
    name: item.name,
    type: isFolder ? "folder" : item.type,
    items: isFolder ? item.subfolders.length + item.files.length + " items" : undefined,
    size: !isFolder ? item.size : undefined,
    modified: item.createdAt,
    isFavorite: item.isFavorite
});

router.post("/enterprise", middleware, async (req, res) => {
    try
    {
        //this is to check if the enterprise folder already exists but it is not working
        const enterpriseFolder = await client.folder.findFirst({
            where: {
                parentFolderId: null,
                name:"enterprise",
            }
        })

        if(enterpriseFolder){
            res.status(400).json({message: "Enterprise folder already exists"})
            return
        }
        await client.folder.create({
            data: {
                name: "enterprise",
                creatorId: req.userId!,
                parentFolderId: null,
                path: "root"
            }
        })

        

        res.json({
            message: "Enterprise Folder created successfully",
            ok: true
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

    try {
        const hashedPassword = await hash(parsedData.data.password)
        
        const user = await client.user.create({
            data: {
                usermail: parsedData.data.username,
                password: hashedPassword,
                name: parsedData.data.name,
            }
        })

        const personal = await client.folder.create({
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
            token,
            username:user.usermail,
            name:user.name
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
        const user = await client.user.findFirst({
            where: {
                usermail: parsedData.data.username
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
            name: user.name,
        }, JWT_PASSWORD);

        res.json({
            message:"User signed in successfully",
            token,
            username:user.usermail,
            name:user.name
        })
    } catch(e) {
        res.status(400).json({message: "Internal server error"})
        
    }
})


router.get("/enterprise",middleware, async (req, res) => {
    try{
        const enterprise = await client.folder.findFirst({
            where: {
                parentFolderId: null,
                name:"enterprise",
            },
            include: {
                files:true,
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

        const enterpriseFolder = enterprise.subfolders.map((folder)=>formatItem(folder, true));
        const enterpriseFiles = enterprise.files.map((file) => formatItem(file, false));

        res.json({
            enterpriseFolder,
            enterpriseFiles,
            EnterperiseId: enterprise.id
        })
    }
    catch(e){
        res.status(400).json({message: "No such directories as enterprise"})
    }
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
        res.status(404).json({ message: "Personal folder not found" });
        return;
    }

    const personalFolder = personalWorkspace.subfolders.map((folder) => formatItem(folder, true));
    const personalFiles = personalWorkspace.files.map((file) => formatItem(file, false));

    res.json({
        personalFolder,
        personalFiles,
        personalWorkspaceId: personalWorkspace.id
    })

})

router.get('/me',middleware, async (req, res) => {
    try {
        const user = await client.user.findFirst({
            where:{
                id:req.userId
            }
        })

        if(!user){
            res.status(404).json({
                message: "User not found"
            })
            return
        }
        res.json({
            username: user.usermail,
            name: user.name,
        })
    }
    catch(err){
        res.json({
            message: "Internal server error"
        })
    }
})

router.get("/userGuide",middleware, async (req, res) => {
    try {
        const userGuide = await client.folder.findFirst({
            where:{
                parentFolderId:"d810a99b-183e-4e96-8a1e-264d612dcafb",
                name:"user_guide"
            },
            include: {
                files:true,
                subfolders: {
                    include: {
                        subfolders: true,
                        files: true
                    }
                }
            }
        })

        if(!userGuide){
            res.status(404).json({
                message: "User Guide not found"
            })
            return
        }

        const folderData = userGuide.subfolders.map((folder) => formatItem(folder, true));
        const fileData = userGuide.files.map((file) => formatItem(file, false));
        res.json({
            folderData,
            fileData,
            userGuideId: userGuide.id,
            isFavorite: userGuide.isFavorite
        })
    }
    catch(err){
        res.json({
            message: "User Guide not found"
        })
    }
})

router.delete("/me", middleware, async (req, res) => {
    try {
        const user = await client.user.findFirst({
            where:{
                id:req.userId
            }
        })
        if(!user){
            res.status(404).json({
                message: "User not found"
            })
            return
        }

        // Delete all associated data in a specific order
        await client.file.deleteMany({ where: { creatorId: req.userId } });
        await client.folder.deleteMany({ where: { creatorId: req.userId } });
        await client.recentlyViewed.deleteMany({ where: { userId: req.userId } });
        await client.workflows.deleteMany({ where: { userId: req.userId } });
        await client.assignment.deleteMany({ where: { userId: req.userId } });

        // Finally, delete the user after all related data is deleted
        await client.user.delete({
            where: {
                id: req.userId
            }
        });

        res.json({
            message: "User deleted successfully",
            ok: true
        })
    }
    catch(err){
        res.json({
            message: "Internal server error"
        })
    }
})



router.use("/folder", folderRouter);
router.use("/file", fileRouter);
router.use("/favorite", favoritesRouter);
router.use("/recentlyviewed", recentlyViewedRouter);
router.use("/assignment", assignmentRouter);
router.use("/workflow", workflowRouter);
router.use("/admin", adminRouter);

