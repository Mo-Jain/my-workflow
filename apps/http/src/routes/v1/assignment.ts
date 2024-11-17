import { Router} from "express";
import { middleware } from "../../middleware";
import client from "@repo/db/client";
import { createAssignmentSchema, updateAssignmentSchema } from "../../types";

export const assignmentRouter = Router();

assignmentRouter.get("/", middleware, async (req, res) => {
    try {
        
        const assignments = await client.workflows.findMany({
            where: {
                assigneeId: req.userId
            },
            include: {
                files: true,
                creator: true
            }
        })

        const assignmentData = assignments.map((assignment:any) => ({
            id: assignment.id,
            name: assignment.currentStep,
            location: assignment.workflowName,
            dueDate: assignment.dueDate ?? null,
            priority: "medium",
            status: assignment.status,
            from: assignment.creator.name,
        }))
        

        res.json({
            assignmentData
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
        
        const assignment = await client.assignment.create({
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
            message: "Assignment created successfully",
            id: assignment
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
                id: req.params.id
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