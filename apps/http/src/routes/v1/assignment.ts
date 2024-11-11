import { Router} from "express";
import { middleware } from "../../middleware";
import client from "@repo/db/client";
import { createAssignmentSchema, updateAssignmentSchema } from "../../types";

export const assignmentRouter = Router();

assignmentRouter.get("/", middleware, async (req, res) => {
    try {
        const user = await client.user.findFirst({
            where: {
                id: req.userId
            },
            include: {
                assignments: true
            }
        })

        if (!user) {
            res.status(404).json({ message: "User not found" })
            return
        }

        const assignment = user?.assignments.map((assignment:any) => ({
            id: assignment.id,
            name: assignment.name,
            location: assignment.location,
            dueDate: assignment.dueDate ?? null,
            priority: assignment.priority,
            status: assignment.status,
            from: user?.username,
        }))

        res.json({
            assignment
        })
    } catch (e) {
        res.status(400).json({ message: "Internal server error" })
    }
})

assignmentRouter.post("/", middleware, async (req, res) => {
    const parsedData = createAssignmentSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "Wrong folder input format" })
        return
    }

    try {
        
        await client.assignment.create({
            data: {
                userId: req.userId!,
                name: parsedData.data.name,
                location: parsedData.data.location,
                dueDate: parsedData.data.dueDate ?? null,
                priority: parsedData.data.priority ?? "medium",
                status: parsedData.data.status ?? "ok",
            }
        })

        res.json({
            message: "Assignment created successfully"
        })
    } catch (e) {
        res.status(400).json({ message: "Internal server error" })
    }
})

assignmentRouter.put("/:id", middleware, async (req, res) => {
    //Todo change this according to the new types defined
    const parsedData = updateAssignmentSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "Wrong folder input format" })
        return
    }

    try {
        
        await client.assignment.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                location: parsedData.data.location,
            }
        })

        res.json({
            message: "Assignment updated successfully"
        })
    } catch (e) {
        res.status(400).json({ message: "Internal server error" })
    }
})