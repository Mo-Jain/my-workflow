import { Router} from "express";
import { middleware } from "../../middleware";
import client from "@repo/db/client";
import { createAssignmentSchema, updateAssignmentSchema } from "../../types";

export const assignmentRouter = Router();

assignmentRouter.get("/", middleware, async (req, res) => {
    try {
        
        const assignments = await client.workflows.findMany({
            where: {
                currentAssigneeId: req.userId
            },
            include: {
                files: true,
                creator: true
            }
        })

        const assignmentData = assignments.map(assignment => ({
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

assignmentRouter.post("/:workflowId", middleware, async (req, res) => {
    const parsedData = createAssignmentSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "Wrong folder input format" })
        return
    }
    
    try {
        
        const approverData = parsedData.data.Aprovers.map((approver, index) => ({
            userId: approver,
            workflowId: parseInt(req.params.workflowId),
            order: index+1
        }))

        const assignment = await client.assignment.createMany({
                    data: approverData
        })

        res.json({
            message: "User Assigned successfully",
            id: assignment
        })
    } catch (e) {
        res.status(400).json({ message: "Internal server error while creating assignment" })
    }
})

assignmentRouter.put("/:workflowId", middleware, async (req, res) => {
    //Todo change this according to the new types defined
    const parsedData = updateAssignmentSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "Wrong folder input format" })
        return
    }

    try {

         const currentAssignment = await client.assignment.findFirst({
            where: {
                workflowId: parseInt(req.params.workflowId),
                userId:req.userId,
              }
          });

          if(!currentAssignment){
            res.status(404).json({message: "Assignment not found"})
            return
          }

         await client.approvalRecord.create({
            data: {
              workflowId: parseInt(req.params.workflowId),
              userId:req.userId!,
            },
          });
        
          // Get the next assignee based on the current order
          // If there is no next assignee, set the status to approved
          const nextAssignee = await client.assignment.findFirst({
            where: {
              workflowId : parseInt(req.params.workflowId),
              order: currentAssignment.order + 1,
            },
          });
        
          // Update the workflow's current assignee
          await client.workflows.update({
            where: { id: parseInt(req.params.workflowId) },
            data: {
              currentAssigneeId: nextAssignee?.userId || null, // Null if no next assignee
              status: nextAssignee ? "in progress" : "approved", // Update status
            },
          });

        res.json({
            message: "Assignment approved and updated successfully",
        })
    } catch (e) {
        res.status(400).json({ message: "Internal server error" })
    }
})