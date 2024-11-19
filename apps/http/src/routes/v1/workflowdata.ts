import Router from "express";
import { middleware } from "../../middleware";
import client from "@repo/db/client";
import { createWorkflowDataSchema } from "../../types";

const workflowDataRouter = Router();


workflowDataRouter.get("/", middleware, async (req, res) => {
    try {
        const workflowData = await client.workflowData.findMany({
            where: {
                userId: req.userId
            }
        })

        res.json({
            workflowData
        })
    } catch (e) {
        res.status(400).json({ message: "Internal server error" })
    }
})

workflowDataRouter.get("/:workflowId", middleware, async (req, res) => {
    try {
        const workflowData = await client.workflowData.findFirst({
            where: {
                workflowId: parseInt(req.params.workflowId)
            },
            include :{
                workflow: {
                    include: {
                        currentAssigneeUser: true,
                        approvers: {
                            include: {
                                user: true
                            },
                        },
                        creator: true,
                        // files:true
                    }
                }
            }
        })


        if (!workflowData) {
            res.status(404).json({ message: "Workflow data not found" })
            return
        }

        res.json({
            workflowData,
            
        })
    } catch (e) {
        res.status(400).json({ message: "Internal server error" })
    }
})

workflowDataRouter.post("/:workflowId", middleware, async (req, res) => {
    try {
        const parsedData = createWorkflowDataSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({ message: "Wrong workflow data format" })
            return
        }

        const workflowData = await client.workflowData.create({
            data: {
                workflowId: parseInt(req.params.workflowId),
                userId: req.userId!,
                workflowName: parsedData.data.workflowName,
                department: parsedData.data.department,
                companyName: parsedData.data.companyName,
                site: parsedData.data.site,
                referenceNumber: parsedData.data.referenceNumber,
                sbu: parsedData.data.sbu,
                clauseNumber: parsedData.data.clauseNumber,
                workflowType: parsedData.data.workflowType,
                subject: parsedData.data.subject,
                to: parsedData.data.to,
                project: parsedData.data.project,
                remarks: parsedData.data.remarks,
                finalApproval: parsedData.data.finalApproval === "yes" ? true : false,
                notification: parsedData.data.notification === "yes" ? true : false
            }
        })

        res.json({
            message: "Workflow data created successfully",
            workflowData
        })
       
    } catch (e) {
        res.status(400).json({ message: "Internal server error" })
    }
})




export default workflowDataRouter;
