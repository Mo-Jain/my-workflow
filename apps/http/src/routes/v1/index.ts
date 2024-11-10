import { Router } from "express";
import jwt from "jsonwebtoken";

import { JWT_PASSWORD } from "../../config";
import { SigninSchema, SignupSchema } from "../../types";
import {hash, compare} from "../../scrypt";
import client from "@repo/db/src";
import { middleware } from "../../middleware";

export const router = Router();

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
        res.json({
            userId: user.id
        })
    } catch(e) {
        console.log("erroer thrown")
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
            token
        })
    } catch(e) {
        res.status(400).json({message: "Internal server error"})
    }
})

router.get("/enterprise",middleware, async (req, res) => {
    const enterprise = await client.enterprise.findFirst({
        where: {
            id: 1
        },
        include: {
            folders: true
        }
    })

    if (!enterprise) {
        res.status(404).json({ message: "Enterprise not found" });
        return;
    }

    const enterpriseFolders = enterprise.folders.map((folder) => {
        return {
            id: folder.id,
            name: folder.name,
            userId: folder.userId,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt,
        };
    });

    res.status(200).json({ enterpriseFolders });
})


    