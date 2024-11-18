import { Router} from "express";
import { middleware } from "../../middleware";
import client from "@repo/db/client";
import { createWorkflowSchema, updateWorkflowSchema } from "../../types";

export const workflowRouter = Router();

workflowRouter.get("/", middleware, async (req, res) => {
    try {

        const workflows = await client.workflows.findMany({
            where: {
                creatorId: req.userId
            },
            include: {
                files: true,
                currentAssigneeUser: true
            }
        })

        const workflowData = workflows.map((workflow) => ({
            id: workflow.id,
            status: workflow.status,
            dueDate: workflow.dueDate ?? null,
            workflowName: workflow.workflowName,
            currentStep: workflow.currentStep,
            assignedTo: workflow.currentAssigneeUser?.name,
            startDate: workflow.startDate,
            files: workflow.files
        }))

        res.json({
            workflowData
        })
    } catch (e) {
        console.error(e);
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
        
        const selectedFilesId = parsedData.data.selectedFilesId.map(fileId => ({ id: fileId }));
``
        const workflow = await client.workflows.create({
            data: {
                creatorId: req.userId!, // Set the creator
                dueDate: parsedData.data.dueDate ?? null,
                workflowName: parsedData.data.workflowName,
                currentStep: parsedData.data.currentStep,
                currentAssigneeId: req.userId,
                assignees: {
                    create: [
                    { userId: req.userId! }, // Add the creator as an initial assignee if needed
                                                // Add other assignees as required
                        ],
                    },
                files: {
                    connect: selectedFilesId
                    }
                },
                include:    {
                    currentAssigneeUser:true, // Include assigned users in the response
                    files: true
                },
            });   

        res.json({
            message: "Workflow created successfully",
            workflow
        })
    } catch (e) {
        console.error(e);
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

    if(data.assigneeId && !data.status){
        updatedData = { assigneeId:data.assigneeId }
    }else if(!data.assigneeId && data.status){
        updatedData = { status:data.status }
    }else if(data.assigneeId && data.status){
        updatedData = { assigneeId:data.assigneeId, status:data.status }
    }

    try {
        
        await client.workflows.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: updatedData
            })

        res.json({
            message: "Workflow updated successfully",
            id: req.params.id
        })
    } catch (e) {
        res.status(400).json({ message: "Internal server error" })
    }
})

workflowRouter.delete("/:id", middleware, async (req, res) => {
    try {
        await client.assignment.deleteMany({
            where:{
                workflowId:parseInt(req.params.id)
            }
        });

        await client.approvalRecord.deleteMany({
            where:{
                workflowId:parseInt(req.params.id)
            }
        });

        await client.workflows.delete({
            where:{
                id:parseInt(req.params.id)
            }
        });
        res.json({
            message: "Workflow deleted successfully",
            id: req.params.id
        })
    } catch (e) {
        res.status(400).json({ message: "Internal server error" })
    }
})