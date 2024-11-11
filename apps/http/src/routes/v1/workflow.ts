import { Router} from "express";
import { middleware } from "../../middleware";
import client from "@repo/db/client";
import { createWorkflowSchema, updateWorkflowSchema } from "../../types";

export const workflowRouter = Router();

workflowRouter.get("/", middleware, async (req, res) => {
    try {
        const user = await client.user.findFirst({
            where: {
                id: req.userId
            },
            include: {
                workflows: true
            }
        })

        const workflows = user?.workflows.map((workflow:any) => ({
            id: workflow.id,
            status: workflow.status,
            dueDate: workflow.dueDate ?? null,
            workflowName: workflow.workflowName,
            currentStep: workflow.currentStep,
            assignedTo: workflow.assignedTo,
            startDate: workflow.startDate
        }))

        res.json({
            workflows
        })
    } catch (e) {
        res.status(400).json({ message: "Internal server error" })
    }
})

workflowRouter.post("/", middleware, async (req, res) => {
    const parsedData = createWorkflowSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "Wrong workflow input format" })
        return
    }

    try {
        const user = await client.user.findFirst({
            where: {
                id: req.userId
            }
        })

        const workflow = await client.workflows.create({
                            data: {
                                userId: req.userId!,
                                dueDate: parsedData.data.dueDate ?? null,
                                workflowName: parsedData.data.workflowName,
                                currentStep: parsedData.data.currentStep,
                                assignedTo: user?.name!,
                                startDate: new Date()
                            }
                        })

        res.json({
            message: "Workflow created successfully",
            id: workflow.id
        })
    } catch (e) {
        res.status(400).json({ message: "Internal server error" })
    }
})

workflowRouter.put("/:id", middleware, async (req, res) => {
    const parsedData = updateWorkflowSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "Wrong workflow input format for update" })
        return
    }

    const data = parsedData.data;
    
    let updatedData = {};

    if(data.assignedTo && !data.status){
        updatedData = { assignedTo:data.assignedTo }
    }else if(!data.assignedTo && data.status){
        updatedData = { status:data.status }
    }else if(data.assignedTo && data.status){
        updatedData = { assignedTo:data.assignedTo, status:data.status }
    }

    try {
        
        await client.workflows.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: updatedData
        })

        res.json({
            message: "Workflow updated successfully"
        })
    } catch (e) {
        res.status(400).json({ message: "Internal server error" })
    }
})