import { Router} from "express";
import { middleware } from "../../middleware";
import client from "@repo/db/client";
import { createWorkflowSchema, updateWorkflowSchema } from "../../types";

export const workflowRouter = Router();

workflowRouter.get("/all", middleware, async (req, res) => {
    try {

        const workflows = await client.workflows.findMany({
            where: {
                creatorId: req.userId,
                NOT :{
                    status: {
                        in: ["Approved","Rejected"]
                    }
                }
            },
            include: {
                files: true,
                currentAssigneeUser: true,
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
            files: workflow.files,
            stopDate : workflow.stopDate ?? null,
            actions:workflow.actions ?? null
        }))
        
        res.json({
            workflowData
        })
    } catch (e) {
        console.error(e);
        res.status(400).json({ message: "Internal server error" })
    }
})

workflowRouter.get("/report", middleware, async (req, res) => {
    try {
        const workflowReport = await client.workflows.findMany({
            where: {
              OR: [
                { creatorId: req.userId }, // Condition for workflows created by the user
                { 
                  approvers: { 
                    some: { 
                        userId: req.userId,
                        status: { not: "Task not assigned" }
                     },
                  },
                },
              ],
            },
            include: {
              workflowData: true,
              creator: true,
              approvers: true, // Include approvers to fetch approval details
            },
          });
    
        res.json({
            workflowReport
        })
    } catch (e) {
        console.error(e);
        res.status(400).json({ message: "Internal server error" })
    }
})


workflowRouter.get("/:id", middleware, async (req, res) => {
    try {
        const workflow = await client.workflows.findFirst({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                files: true
            }
        })

        if (!workflow) {
            res.status(404).json({ message: "Workflow not found" })
            return
        }

        res.json({
            workflow
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
                type: parsedData.data.type,
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
            workflow,
            creatorId: req.userId
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

    try {
        
        await client.workflows.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    status:parsedData.data.status,
                    currentAssigneeId:null,
                    currentStep:null,
                    stopDate:new Date(),
                }
            })
        
        if(parsedData.data.status === "stopped"){
            await client.workflowData.deleteMany({
                where: {
                    workflowId: parseInt(req.params.id)
                }
            })
        }

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
        

        await client.approvalRecord.deleteMany({
            where:{
                workflowId:parseInt(req.params.id)
            }
        });

        await client.workflowData.deleteMany({
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