'use client'

import * as React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import logo from "../../../public/logo.png"
import { useParams } from "next/navigation"
import axios from "axios"
import { BASE_URL } from "@/next.config"
import { Dialog } from "@radix-ui/react-dialog"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Cross, Crosshair, CrossIcon, LucideCross, Plus } from "lucide-react"
import { useRouter } from "next/router"
import { Approver, ApproverField, InputSearchApprover } from "@/components/SearchApprover"
import { assignmentState } from "@/lib/store/atoms/assignment"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { toaster } from "@/pages/admin"
import { workflowItems } from "@/lib/store/selectors/workflow"
import { workflowState } from "@/lib/store/atoms/workflow"

const CompanyCodes = [
  {
    id: 1,
    name: "Adani Power Limited",
    code: "5500"
  },
  {
    id: 2,
    name: "Kutch Copper Limited",
    code: "1980"
  },
  {
    id: 3,
    name: "Adani Transmission Limited",
    code: "2900"
  },
  {
    id: 4,
    name: "Adani Solar Limited",
    code: "4300"
  },
  {
    id: 5,
    name: "Adani Enterprises Limited",
    code: "1000"
  }
]

const DepartmentCodes = [
  {
    id: 1,
    name: "Information Technology",
    code: "IT"
  },
  {
    id: 2,
    name: "Human Resources",
    code: "HR"
  },
  {
    id: 3,
    name: "Finance",
    code: "F&A"
  },
  {
    id: 4,
    name: "Buisness Development",
    code: "BD"
  },
  {
    id: 5,
    name: "Marketing",
    code: "Marketing"
  },
  {
    id: 6,
    name: "Sales",
    code: "Sales"
  },
  {
    id: 7,
    name: "Operations",
    code: "OPS"
  },
  {
    id: 8,
    name: "Project Management",
    code: "PM"
  },
  {
    id: 9,
    name: "Projects",
    code: "PROJ"
  }
]


export default function NFAForm() {
  const [formData, setFormData] = React.useState({
    workflowName: "",
    department: "",
    companyName: "",
    site: "",
    referenceNumber: "",
    sbu: "",
    clauseNumber: "",
    workflowType: "Sequential",
    subject: "",
    to: "",
    project: "",
    remarks: "",
    finalApproval: "no",
    notification: "no",
  })
  interface Approver {
    id: string;
    name: string;
    step: string;
}

  const [docSetType,setDocSetType] = useState<string>();
  const [departmentCode,setDepartmentCode] = useState<string | undefined>();
  const [companyCode,setCompanyCode] = useState<string>();
  const [activity,setActivity] = useState<string>();
  const workflowIdObj = useParams();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const router = useRouter();
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [approversFinal, setApproversFinal] = useState<Approver[]>([]);
  const setAssignment = useSetRecoilState(assignmentState);
  const assignment = useRecoilValue(assignmentState);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = React.useState(false);
  const workflows = useRecoilValue(workflowItems);
  const setWorkflow = useSetRecoilState(workflowState);
 

  useEffect(() => {
    if(formData.companyName){
      setCompanyCode(CompanyCodes.filter(company => company.name === formData.companyName)[0].code)
    }
   
  }, [formData.companyName])

  useEffect(() => {
    if(formData.department){
      setDepartmentCode(DepartmentCodes.filter(department => department.name === formData.department)[0].code)
    }
  }, [formData.department])

  useEffect(() => {
    if(!workflowIdObj || !workflowIdObj?.workflowId ) return;
    async function fetchData() {
        try {
          const res = await axios.get(`${BASE_URL}/api/v1/workflow/${workflowIdObj.workflowId}`,{
            headers:{
              authorization : `Bearer `+ localStorage.getItem('token')
            }
          })
          console.log(res.data.workflow)
          setDocSetType(res.data.workflow.type);
        }
        catch (error) {
          console.log(error);
        }
      }
      fetchData();

  }, [workflowIdObj])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const generateNumber = () => {
    if( !departmentCode || !companyCode || formData.site === "") {
        setIsDialogOpen(true);
        return
    };
    const number = companyCode + "-" + departmentCode + "-" + formData.site + "-" + (new Date().toISOString().slice(0, 7)) + "-" + Math.floor(Math.random() * 1000);
    setFormData(prevData => ({
      ...prevData,
      referenceNumber: number
    }))
  }

  const handleSubmitWorkflow = async () => {

    try{

      let newApprovers = approvers.map((approver) => {
        return({
        id: approver.id,
        name: "myname",
        step:formData.workflowType + " Approval", 
      })})

      newApprovers = [...newApprovers, ...approversFinal];

      console.log(newApprovers);

      const res = await axios.post(`${BASE_URL}/api/v1/workflowdata/${workflowIdObj.workflowId}`, formData, {
        headers:{
          authorization : `Bearer `+ localStorage.getItem('token')
        }
      })  

      console.log("formData.workflowType :",formData.workflowType); 



      const workflow = workflows.filter(workflow => workflow.id == workflowIdObj.workflowId)[0];
      const workflowName = workflow.workflowName.slice(0,8) + "-"+formData.referenceNumber;
      await axios.post(`${BASE_URL}/api/v1/assignment/${workflowIdObj.workflowId}`,
        {
          approvers: newApprovers,
          currentStep:formData.workflowType + " Approval",
          workflowName: workflowName
        }, {
        headers:{
          authorization : `Bearer `+ localStorage.getItem('token')
        }
      })  

      setWorkflow(prevWorkflows => ({
        ...prevWorkflows,
        items: prevWorkflows.items.map(item => {
          if(item.id == workflowIdObj.workflowId){
            return {
              ...item,
              workflowName: workflowName,
              currentStep: formData.workflowType + " Approval",
              assignedTo: approvers[0].name,
            }
          }
          else{
            return item;
          }
        })
      }))
   
      setAssignment(prevAssignment => ({  
        isLoading:false,
        items: prevAssignment.items.filter(item => item.id != workflowIdObj.workflowId)
      }))
      console.log("assignment below", assignment);

      toaster("submitted workflow","", false)

      router.push("/")
    }
    catch(error){
      console.log(error)
    }
    
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(approvers.length === 0){
      toaster("Please add approvers","",true)
      return
    }
    setIsSubmitDialogOpen(true)
  }

  return (
    <div className="min-h-screen py-4" style={{ backgroundColor: 'gray', color: '#171717' }}>
      <div className="mx-auto max-w-6xl bg-white p-6">
        <div className="flex items-center justify-between mb-8 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-md" />
            <h1 className="text-2xl font-semibold">NFA Form</h1>
          </div>
          <div className="flex items-center gap-2">
            <Image 
              src={logo}
              width={100}
              height={70}
              alt="Adani Natural Resources" 
              className="h-10"
            />
            <Label className="text-sm text-center">Natural Resources</Label>
          </div>          
        </div>

        <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
          <div className="grid grid-cols-8 gap-x-4 gap-y-2">
            {/* Column 1 - Labels */}
            <div className="col-span-1 space-y-2">
              <Label htmlFor="workflowName" className="block h-8 flex items-center justify-end text-xs">Workflow Name <span className="text-red-500">*</span></Label>
              <Label htmlFor="department" className="block h-8 flex items-center justify-end text-xs">Department <span className="text-red-500">*</span></Label>
              <Label htmlFor="companyName" className="block h-8 flex items-center justify-end text-xs">Company Name <span className="text-red-500">*</span></Label>
              <Label htmlFor="site" className="block h-8 flex items-center justify-end text-xs">Site <span className="text-red-500">*</span></Label>
              <Label htmlFor="referenceNumber" className="block h-8 flex items-center justify-end text-xs">Reference Number <span className="text-red-500">*</span></Label>
              <Label htmlFor="sbu" className="block h-8 flex items-center justify-end text-xs">SBU</Label>
              <Label htmlFor="clauseNumber" className="block h-8 flex items-center justify-end text-xs">Clause Number<span className="text-red-500">*</span> </Label>
              <Label htmlFor="clauseNumber" className="block h-8 flex items-center justify-end text-xs"></Label>
              <Label htmlFor="workflowType" className="block h-8 flex items-center justify-end text-xs">Workflow Type <span className="text-red-500">*</span></Label>
              <Label htmlFor="workflowRole" className="block h-8 flex items-center justify-end text-xs">Workflow Role</Label>              
              <Label htmlFor="multipleWorkflowRole" className="block h-20 pt-2 flex text-right items-start justify-end text-xs">Multiple Workflow Role <span className="text-red-500">*</span></Label>
              <Label htmlFor="docSetType" className="block h-8 flex items-center justify-end text-xs">DocSet Type <span className="text-red-500">*</span></Label>
              <Label htmlFor="subject" className="block h-8 flex items-center justify-end text-xs">Subject </Label>
              <Label htmlFor="project" className="block h-8 flex items-center justify-end text-xs">Project </Label>
              <Label htmlFor="remarks" className="block h-20 pt-2 flex items-start justify-end text-xs">Remarks </Label>
              <Label htmlFor="finalApproval" className="block h-8 flex items-center text-right justify-between text-xs">Final approval Required? </Label>
              {formData.finalApproval === "yes" && 
                <div className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  formData.finalApproval === "yes" ? "max-h-[500px]" : "max-h-0"
                }`}>
                  <Label htmlFor="workflowRole" className="block h-8 flex items-center justify-end text-xs">Workflow Role</Label>              
                  <Label htmlFor="multipleWorkflowRole" className="block h-20 pt-2 flex text-right items-start justify-end text-xs">Final Approval Role <span className="text-red-500">*</span></Label>
                </div>
              }
              <Label htmlFor="notification" className="block h-8 flex items-center text-right justify-end text-xs">Notification Required? </Label>
            </div>

            {/* Column 2 - Fields */}
            <div className="col-span-3 space-y-2">
              <Input id="workflowName" name="workflowName" value={formData.workflowName} onChange={handleInputChange} required className="w-full h-8 text-xs " />
              <Select required value={formData.department} onValueChange={handleSelectChange("department")}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Information Technology" className="w-full h-8 text-xs">Information Technology</SelectItem>
                  <SelectItem value="Human Resources" className="w-full h-8 text-xs">Human Resources</SelectItem>
                  <SelectItem value="Finance" className="w-full h-8 text-xs">Finance</SelectItem>
                  <SelectItem value="Buisness Development" className="w-full h-8 text-xs">Buisness Development</SelectItem>
                  <SelectItem value="Marketing" className="w-full h-8 text-xs">Marketing</SelectItem>
                  <SelectItem value="Sales" className="w-full h-8 text-xs">Sales</SelectItem>
                  <SelectItem value="Operations" className="w-full h-8 text-xs">Operations</SelectItem>
                  <SelectItem value="Project Management" className="w-full h-8 text-xs">Project Management</SelectItem>
                  <SelectItem value="Projects" className="w-full h-8 text-xs">Projects</SelectItem>
                </SelectContent>
              </Select>
              <Select required value={formData.companyName} onValueChange={handleSelectChange("companyName")}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Adani Power Limited" className="w-full h-8 text-xs">Adani Power Limited</SelectItem>
                  <SelectItem value="Kutch Copper Limited" className="w-full h-8 text-xs">Kutch Copper Limited</SelectItem>
                  <SelectItem value="Adani Transmission Limited" className="w-full h-8 text-xs">Adani Transmission Limited</SelectItem>
                  <SelectItem value="Adani Solar Limited" className="w-full h-8 text-xs">Adani Solar Limited</SelectItem>
                  <SelectItem value="Adani Enterprises Limited" className="w-full h-8 text-xs">Adani Enterprises Limited</SelectItem>
                </SelectContent>
              </Select>
              <Select required value={formData.site} onValueChange={handleSelectChange("site")}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Select Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ATMSL" className="w-full h-8 text-xs">ATMSL</SelectItem>
                  <SelectItem value="Bailadila" className="w-full h-8 text-xs">Bailadila</SelectItem>
                  <SelectItem value="Ballada" className="w-full h-8 text-xs">Ballada</SelectItem>
                  <SelectItem value="Bhubneshwar" className="w-full h-8 text-xs">Bhubneshwar</SelectItem>
                  <SelectItem value="Bijahan" className="w-full h-8 text-xs">Bijahan</SelectItem>
                  <SelectItem value="Bisrampur" className="w-full h-8 text-xs">Bisrampur</SelectItem>
                  <SelectItem value="Chitrakoot" className="w-full h-8 text-xs">Chitrakoot</SelectItem>
                  <SelectItem value="Corporate" className="w-full h-8 text-xs">Corporate</SelectItem>
                  <SelectItem value="Dharmapur" className="w-full h-8 text-xs">Dharmapur</SelectItem>
                  <SelectItem value="Dhupguri" className="w-full h-8 text-xs">Dhupguri</SelectItem>
                  <SelectItem value="Gaya" className="w-full h-8 text-xs">Gaya</SelectItem>
                  <SelectItem value="Mundra" className="w-full h-8 text-xs">Mundra</SelectItem>
                </SelectContent>
              </Select>
              <Input id="referenceNumber" name="referenceNumber" value={formData.referenceNumber} onChange={handleInputChange} required className="w-full h-8 text-xs" />
              <Select value={formData.sbu} onValueChange={handleSelectChange("sbu")}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Select SBU" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sbu1" className="w-full h-8 text-xs">SBU 1</SelectItem>
                  <SelectItem value="sbu2" className="w-full h-8 text-xs">SBU 2</SelectItem>
                </SelectContent>
              </Select>
              <div className="space-y-2">
                <Select required value={formData.clauseNumber} onValueChange={handleSelectChange("clauseNumber")}>
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue placeholder="Select Clause" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clause1" className="w-full h-8 text-xs">Clause 1</SelectItem>
                    <SelectItem value="clause2" className="w-full h-8 text-xs">Clause 2</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" className="w-1/3 h-8 text-xs" onClick={() => handleSelectChange("clauseNumber")("")}>Clear Clause</Button>
              </div>
              <Select required value={formData.workflowType} onValueChange={handleSelectChange("workflowType")}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Select Workflow Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sequential" className="w-full h-8 text-xs">Sequential</SelectItem>
                  <SelectItem value="Flexi-Flow" className="w-full h-8 text-xs">Flexi-Flow</SelectItem>
                </SelectContent>
              </Select>
              <InputSearchApprover approvers={approvers} setApprovers={setApprovers} className="w-full h-8 text-xs border-2 border-gray-200" finalApproval={false} />
              <ApproverField approvers={approvers} setApprovers={setApprovers} className="w-full h-20 text-xs border-2 border-gray-200 p-3" />
              <Select required value={docSetType} disabled={docSetType? true : false} >
                <SelectTrigger className="w-full h-8 text-xs cursor-not-allowed disabled:bg-gray-400 disabled:text-black" >
                  <SelectValue placeholder="Select DocSet Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NFA" className="w-full h-8 text-xs">NFA</SelectItem>
                  <SelectItem value="Letter" className="w-full h-8 text-xs">Letter</SelectItem>
                </SelectContent>
              </Select>
              <Input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full h-8 text-xs" />
              <Input id="project" name="project" value={formData.project} onChange={handleInputChange} className="w-full h-8 text-xs" />
              <Textarea id="remarks" name="remarks" value={formData.remarks} onChange={handleInputChange} className="min-h-[5rem] text-xs" />
              <Select  value={formData.finalApproval} onValueChange={handleSelectChange("finalApproval")}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes" className="w-full h-8 text-xs">Yes</SelectItem>
                  <SelectItem value="no" className="w-full h-8 text-xs">No</SelectItem>
                </SelectContent>
              </Select>
              <div
                className={` transition-all duration-200 ease-in-out ${
                  formData.finalApproval === "yes" ? "max-h-[500px]" : "max-h-0 overflow-hidden"  
                }`}
              >
                <InputSearchApprover
                  approvers={approversFinal}
                  setApprovers={setApproversFinal}
                  className={`w-full h-8 mt-1 text-xs border-2 border-gray-200`}
                  finalApproval={formData.finalApproval === "yes" ? true : false}
                />
                <ApproverField
                  approvers={approversFinal}
                  setApprovers={setApproversFinal}
                  className={`w-full h-20 mt-3 text-xs border-2 border-gray-200 p-3`}
                />
              </div>
              <Select  value={formData.notification} onValueChange={handleSelectChange("notification")}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes" className="w-full h-8 text-xs">Yes</SelectItem>
                  <SelectItem value="no" className="w-full h-8 text-xs">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Column 3 - Additional Labels */}
            <div className="col-span-1 space-y-2">
              <div className="h-8"></div> {/* Spacer for 1st row */}
              <Label htmlFor="departmentCode" className="block h-8 flex items-center justify-end text-xs">Department Code</Label>
              <Label htmlFor="companyCode" className="block h-8 flex items-center justify-end text-xs">Company Code</Label>
              <div className="h-8"></div> {/* Spacer for 4th row */}
              <Button type="button" variant="outline" className="w-full h-8 text-xs whitespace-nowrap" onClick={generateNumber}>Generate Number</Button>
              <div className="h-8"></div> {/* Spacer for 6th row */}
              <Label htmlFor="activity" className="block h-20 pt-2 flex items-start justify-end text-xs">Activity</Label>
              <div className="h-8"></div> {/* Spacer for 8th row */}
              <div className="h-8"></div> {/* Spacer for 9th row */}
              <div className="h-8"></div> {/* Spacer for 10th row */}
              <div className="h-8"></div> {/* Spacer for 11th row */}
              <div className="h-8"></div> {/* Spacer for 12th row */}
              <Label htmlFor="to" className="block h-8 flex items-center justify-end text-xs">To</Label>
              <div className="h-8"></div> {/* Spacer for 13th row */}
              <div className="h-8"></div> {/* Spacer for 14th row */}
              <div className="h-8"></div> {/* Spacer for 15th row */}
              <div className="h-8"></div> {/* Spacer for 16th row */}
            </div>

            {/* Column 4 - Additional Fields */}
            <div className="col-span-3 space-y-2">
              <div className="h-8"></div> {/* Spacer for 1st row */}
              <Input id="departmentCode" name="departmentCode" value={departmentCode} className="w-full h-8 text-xs cursor-not-allowed" readOnly/>
              <Input id="companyCode" name="companyCode" value={companyCode} className="w-full h-8 text-xs cursor-not-allowed " readOnly />
              <div className="h-8"></div> {/* Spacer for 4th row */}
              <div className="h-8"></div> {/* Spacer for 5th row */}
              <div className="h-8"></div> {/* Spacer for 6th row */}
              <Textarea id="activity" name="activity" value={activity} onChange={() => setActivity(activity)} className="min-h-[5rem] max-h-20 text-xs max-h-20" />
              <div className="h-8"></div> {/* Spacer for 8th row */}
              <Button type="button" variant="outline" className="w-1/3 h-8 text-xs">Remove all approvers</Button>
              <div className="h-8"></div> {/* Spacer for 10th row */}
              <div className="h-8"></div> {/* Spacer for 11th row */}
              <div className="h-8"></div> {/* Spacer for 12th row */}
              <Input id="to" name="to" value={formData.to} onChange={handleInputChange} className="w-full h-8 text-xs" />
              <div className="h-8"></div> {/* Spacer for 13th row */}
              <div className="h-8"></div> {/* Spacer for 14th row */}
              <div className="h-8"></div> {/* Spacer for 15th row */}
              <div className="h-8"></div> {/* Spacer for 16th row */}
            </div>
          </div>

          <div className="flex justify-start gap-4 mt-8">
            <Button type="button" variant="outline" className="text-xs">Cancel</Button>
            <Button type="submit" className="text-xs">Submit</Button>
          </div>
        </form>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white text-black">
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center gap-2 mb-2">
                <span className="p-[1px] rounded-full bg-red-500"><Plus className="h-5 w-5 text-white stroke-2 rotate-45" /></span>
                <span>Error</span>
                </div>
              </DialogTitle>
              <DialogDescription>
                Select any Department, Company and Site first.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="submit" className={`text-white bg-blue-500 hover:bg-blue-600`} onClick={() => {
                setIsDialogOpen(false)
              }}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent className=" bg-white text-black">
          <DialogHeader>
            <DialogTitle>Confirm Workflow Initiation</DialogTitle>
            <DialogDescription>
              Click OK to move the workflow. Do you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setIsSubmitDialogOpen(false)
             
              handleSubmitWorkflow()
            }}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}