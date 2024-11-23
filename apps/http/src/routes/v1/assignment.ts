import { Router} from "express";
import { middleware } from "../../middleware";
import client from "@repo/db/client";
import { createAssignmentSchema, createWorkflowSchema, forwardAssignmentSchema, replyAssignmentSchema, updateAssignmentSchema } from "../../types";

export const assignmentRouter = Router();

function makeCamelCaseLetters(name:string){
  const nameArr = name.split('.');
  nameArr.map(name => name = name.charAt(0).toUpperCase() + name.slice(1));
  return nameArr.join('');
}

assignmentRouter.get("/", middleware, async (req, res) => {
    try {
        
        const assignments = await client.workflows.findMany({
            where: {
                currentAssigneeId: req.userId
            },
            include: {
                creator: true,
                approvers: {
                  where: {
                    userId: req.userId,
                    NOT :{
                      status: {
                        in: ["Approved","Rejected"]
                      }
                    }
                  },
                  include: {
                    parentApproval: {
                      include: {
                        user: true
                      }
                    },
                    workflow: true
                  }
                }
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
            startDate: assignment.startDate,
            creatorId: assignment.creator.id,
            currentApproval: {
              approvalId: assignment.approvers[0].id,
              step: assignment.approvers[0].step,
              parentApprovalId: assignment.approvers[0].parentApproval?.id,
              parentApprovalName: assignment.approvers[0].parentApproval?.user?.name,
              parentApprovalComments: assignment.approvers[0].parentApproval?.comments,
              parentApprovalStatus: assignment.approvers[0].parentApproval?.status,
            }
        }))
        

        res.json({
            assignmentData
        })
    } catch (e) {
        res.status(400).json({ message: "Internal server error" })
    }
})


assignmentRouter.post("/:workflowId", middleware, async (req, res) => {
    
    const parsedData = createAssignmentSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.status(400).json({ message: "Wrong workflow input format" })
        return
    }
    
    try {

        const approverData = parsedData.data.approvers.map((approver, index) => ({
            userId: approver.id,
            workflowId: parseInt(req.params.workflowId),
            order: index+1,
            step: approver.step,
            status:"Task not assigned"
        }))

        approverData[0].status = "In Progress";

        const assignment = await client.approvalRecord.createMany({
                data: approverData
        })

        await client.workflows.update({
            where: { id: parseInt(req.params.workflowId) },
            data: {
              currentAssigneeId: approverData[0].userId,
              currentStep: parsedData.data.currentStep,
              workflowName: parsedData.data.workflowName,
            },
          });


        res.json({
            message: "User Assigned successfully",
            id: assignment
        })
    } catch (e) {
        res.status(400).json({ message: "Internal server error while creating assignment" })
    }
})

assignmentRouter.post("/approve/:id",middleware, async (req, res) => {
    //Todo change this according to the new types defined
    const parsedData = updateAssignmentSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "Wrong folder input format" })
        return
    }

    try {
         const currentApprover = await client.approvalRecord.update({
                where: {
                  id: parseInt(req.params.id),
                },
              data: {
                comments: parsedData.data.comments,
                approvalDate: new Date(),
                status:"Approved"
              }
          });

          console.log(currentApprover);
          if(!currentApprover){
            res.status(404).json({message: "Assignment not found"})
            return
          }
        
          // Get the next assignee based on the current order
          // If there is no next assignee, set the status to approved
          const nextAssignee = await client.approvalRecord.findFirst({
            where: {
              workflowId : currentApprover.workflowId,
              order: currentApprover.order + 1,
            },
          });

          if(nextAssignee){
            await client.approvalRecord.update({
                where: {
                  id: nextAssignee.id,
                },
                data: {
                  status:"In Progress",
                }
              });
          }
        
          // Update the workflow's current assignee
          const workflow = await client.workflows.update({
              where: { id: currentApprover.workflowId },
              data: {
                currentAssigneeId: nextAssignee?.userId || null, // Null if no next assignee
                status: nextAssignee ? "on time" : "Approved", // Update status
                currentStep: nextAssignee?.step || "Approved",
              },
              include: {
                files: true,
              }
            });

          if(!nextAssignee){
            // Create a folder for the workflow
            const folder =   await client.folder.create({
                data: {
                  name: workflow.workflowName,
                  parentFolderId: workflow.files[0].parentFolderId,
                  path: workflow.files[0].path + "/" + workflow.workflowName,
                  creatorId: workflow.files[0].creatorId,
                }
              })

            const files = workflow.files.map((file) => ({
              name: file.name,
              type: file.type,
              size: file.size,
              creatorId: file.creatorId,
              parentFolderId: folder.id,
              path: folder.path + "/" + file.name,
              createdAt: new Date()
            }))
            
            await client.file.createMany({
              data: files
            })
          }

        res.json({
            message: "Assignment approved and updated successfully",
        })
    } catch (e) {
        console.log(e)
        res.status(400).json({ message: "Internal server error" })
    }
})


assignmentRouter.post("/reject/:id",middleware, async (req, res) => {
    //Todo change this according to the new types defined
    const parsedData = updateAssignmentSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "Wrong folder input format" })
        return
    }

    try {
         const currentApprover = await client.approvalRecord.update({
                where: {
                  id: parseInt(req.params.id),
                },
              data: {
                comments: parsedData.data.comments,
                approvalDate: new Date(),
                status:"Rejected"
              }
          });

          if(!currentApprover){
            res.status(404).json({message: "Assignment not found"})
            return
          }
        
          
          await client.workflows.update({
            where: { id: currentApprover.workflowId },
            data: {
              currentAssigneeId:  null, // Null if no next assignee
              status: "Rejected", // Update status
              currentStep: "Rejected",
            },
          });

        res.json({
            message: "Assignment rejected and updated successfully",
        })  
    } catch (e) {
        console.log(e)
        res.status(400).json({ message: "Internal server error" })
    }
})

assignmentRouter.post("/forward/:id",middleware, async (req, res) => {
  //Todo change this according to the new types defined
  const parsedData = forwardAssignmentSchema.safeParse(req.body)
  if (!parsedData.success) {
      res.status(400).json({ message: "Wrong folder input format" })
      return
  }

  try {
      const currentUser = await client.user.findFirst({
        where: {
          id: req.userId
        }
      })
      const forwardedUser = await client.user.findFirst({
        where: {
          id: parsedData.data.userId
        }
      })
      if(!currentUser || !forwardedUser){
        res.json({message: "User not found"});
        return
      }
       const comments = makeCamelCaseLetters(currentUser.name) + " Forwarded To " + makeCamelCaseLetters(forwardedUser.name) + " with comments:\n" + parsedData.data.comments;

       const currentApprover = await client.approvalRecord.update({
              where: {
                id: parseInt(req.params.id),
              },
            data: {
              comments: comments,
              approvalDate: new Date(),
              status:"Forwarded"
            }
        });

        if(!currentApprover){
          res.status(404).json({message: "Approver not found"})
          return
        }

        await client.approvalRecord.create({
          data: {
            userId: parsedData.data.userId,
            workflowId: currentApprover.workflowId,
            order: currentApprover.order,
            step: currentApprover.step,
            status:"In Progress",
            parentApprovalId: currentApprover.id
          }
        }) 
      
        await client.workflows.update({
          where: { id: currentApprover.workflowId },
          data: {
            currentAssigneeId:  parsedData.data.userId, 
          },
        });

      res.json({
          message: "Assignment forwarded and updated successfully",
      })  
  } catch (e) {
      console.log(e)
      res.status(400).json({ message: "Internal server error" })
  }
})

assignmentRouter.post("/sendforreview/:id",middleware, async (req, res) => {
  //Todo change this according to the new types defined
  const parsedData = forwardAssignmentSchema.safeParse(req.body)
  if (!parsedData.success) {
      res.status(400).json({ message: "Wrong folder input format" })
      return
  }

  try {
      const currentUser = await client.user.findFirst({
        where: {
          id: req.userId
        }
      })
      const forwardedUser = await client.user.findFirst({
        where: {
          id: parsedData.data.userId
        }
      })
      if(!currentUser || !forwardedUser){
        res.json({message: "User not found"});
        return
      }
       const comments = makeCamelCaseLetters(currentUser.name) + " Sent for review To " + makeCamelCaseLetters(forwardedUser.name) + " with comments:\n" + parsedData.data.comments;
      
       const currentApprover = await client.approvalRecord.update({
              where: {
                id: parseInt(req.params.id),
              },
            data: {
              comments: comments,
              approvalDate: new Date(),
              status:"Sent for review"
            }
        });

        if(!currentApprover){
          res.status(404).json({message: "Approver not found"})
          return
        }

        await client.approvalRecord.create({
          data: {
            userId: parsedData.data.userId,
            workflowId: currentApprover.workflowId,
            order: currentApprover.order,
            step: currentApprover.step,
            status:"In Progress",
            parentApprovalId: currentApprover.id
          }
        }) 
      
        await client.workflows.update({
          where: { id: currentApprover.workflowId },
          data: {
            currentAssigneeId:  parsedData.data.userId, 
          },
        });

      res.json({
          message: "Assignment forwarded and updated successfully",
      })  
  } catch (e) {
      console.log(e)
      res.status(400).json({ message: "Internal server error" })
  }
})

assignmentRouter.post("/reply/:id",middleware, async (req, res) => {
  const parsedData = replyAssignmentSchema.safeParse(req.body)
  if (!parsedData.success) {
      res.status(400).json({ message: "Wrong folder input format" })
      return
  }
  try {
    
    const parentApprover = await client.approvalRecord.findFirst({  
      where: {
        id: parsedData.data.id
      },
    })
    if(!parentApprover){
      res.status(400).json({message: "Parent Approver record not found"})
      return
    }

    await client.approvalRecord.update({
      where: {
        id: parentApprover.id
      },
      data: {
        comments: parentApprover.comments + "\hl" + req.name + " "+ parsedData.data.comments,
        approvalDate: new Date(),
        status:"Sent for review"
      }
    });


    const currentApprover = await client.approvalRecord.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        userId: parentApprover.userId,
        comments: null,
        status:"In Progress",
        parentApprovalId: null
      }
    });

    await client.workflows.update({
      where: { id: currentApprover.workflowId },
      data: {
        currentAssigneeId:  parentApprover.userId, 
      },
    });

    if(!currentApprover){
      res.status(400).json("Current approver not found");
      return
    }

    res.json({
      message: "Assignment forwarded and updated successfully",
    })  
  } catch (e) {
      console.log(e)
      res.status(400).json({ message: "Internal server error" })
  }
})


