'use client'

import * as React from "react"
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
import logo from "../public/logo.png"

export default function NFAForm() {
  const [formData, setFormData] = React.useState({
    workflowName: "",
    department: "",
    companyName: "",
    site: "",
    referenceNumber: "",
    sbu: "",
    clauseNumber: "",
    workflowType: "sequential",
    subject: "",
    to: "",
    project: "",
    remarks: "",
    finalApproval: "",
    notification: "",
  })

  const [multipleWorkflowRole,setMultipleWorkflowRole] = React.useState<string>();
  const [docSetType,setDocSetType] = React.useState<string>();
  const [departmentCode,setDepartmentCode] = React.useState<string>();
  const [companyCode,setCompanyCode] = React.useState<string>();
  const [activity,setActivity] = React.useState<string>();

  React.useEffect(() => {
    console.log(formData);
  }, [formData])

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
    const number = Math.random().toString(36).substring(7).toUpperCase()
    setFormData(prevData => ({
      ...prevData,
      referenceNumber: `REF-${number}`
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    
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
              <Label htmlFor="multipleWorkflowRole" className="block h-20 pt-2 flex text-right items-start justify-end text-xs">Multiple Workflow Role <span className="text-red-500">*</span></Label>
              <Label htmlFor="docSetType" className="block h-8 flex items-center justify-end text-xs">DocSet Type <span className="text-red-500">*</span></Label>
              <Label htmlFor="subject" className="block h-8 flex items-center justify-end text-xs">Subject </Label>
              <Label htmlFor="project" className="block h-8 flex items-center justify-end text-xs">Project </Label>
              <Label htmlFor="remarks" className="block h-20 pt-2 flex items-start justify-end text-xs">Remarks </Label>
              <Label htmlFor="finalApproval" className="block h-8 flex items-center text-right justify-between text-xs">Final approval Required? </Label>
              <Label htmlFor="notification" className="block h-8 flex items-center text-right justify-end text-xs">Notification Required? </Label>
            </div>

            {/* Column 2 - Fields */}
            <div className="col-span-3 space-y-2">
              <Input id="workflowName" name="workflowName" value={formData.workflowName} onChange={handleInputChange} required className="w-full h-8 text-xs" />
              <Select required value={formData.department} onValueChange={handleSelectChange("department")}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="it" className="w-full h-8 text-xs">Information Technology</SelectItem>
                  <SelectItem value="hr" className="w-full h-8 text-xs">Human Resources</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              <Select required value={formData.companyName} onValueChange={handleSelectChange("companyName")}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adani" className="w-full h-8 text-xs">Adani Corporation</SelectItem>
                  <SelectItem value="subsidiary" className="w-full h-8 text-xs">Subsidiary Co.</SelectItem>
                </SelectContent>
              </Select>
              <Select required value={formData.site} onValueChange={handleSelectChange("site")}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Select Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="site1" className="w-full h-8 text-xs">Site 1</SelectItem>
                  <SelectItem value="site2" className="w-full h-8 text-xs">Site 2</SelectItem>
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
                  <SelectItem value="sequential" className="w-full h-8 text-xs">Sequential</SelectItem>
                  <SelectItem value="parallel" className="w-full h-8 text-xs">Flexi-flow</SelectItem>
                </SelectContent>
              </Select>
              <div className="col-span-3 space-y-2">
                <Textarea 
                  id="multipleWorkflowRole" 
                  name="multipleWorkflowRole" 
                  value={multipleWorkflowRole} 
                  onChange={(e) => setMultipleWorkflowRole(e.target.value)}
                  required 
                  className="min-h-[5rem] max-h-20 text-xs col-span-1 space-y-2" 
                />
              </div>
              <Select required value={docSetType} onValueChange={(value) => setDocSetType(value)}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Select DocSet Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nfa" className="w-full h-8 text-xs">NFA</SelectItem>
                  <SelectItem value="letter" className="w-full h-8 text-xs">Letter</SelectItem>
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
              <Label htmlFor="to" className="block h-8 flex items-center justify-end text-xs">To</Label>
              <div className="h-8"></div> {/* Spacer for 12th row */}
              <div className="h-8"></div> {/* Spacer for 13th row */}
              <div className="h-8"></div> {/* Spacer for 14th row */}
              <div className="h-8"></div> {/* Spacer for 15th row */}
              <div className="h-8"></div> {/* Spacer for 16th row */}
            </div>

            {/* Column 4 - Additional Fields */}
            <div className="col-span-3 space-y-2">
              <div className="h-8"></div> {/* Spacer for 1st row */}
              <Input id="departmentCode" name="departmentCode" value={departmentCode} onChange={() => setDepartmentCode(departmentCode)} className="w-full h-8 text-xs" />
              <Input id="companyCode" name="companyCode" value={companyCode} onChange={() => setCompanyCode(companyCode)} className="w-full h-8 text-xs" />
              <div className="h-8"></div> {/* Spacer for 4th row */}
              <div className="h-8"></div> {/* Spacer for 5th row */}
              <div className="h-8"></div> {/* Spacer for 6th row */}
              <Textarea id="activity" name="activity" value={activity} onChange={() => setActivity(activity)} className="min-h-[5rem] max-h-20 text-xs max-h-20" />
              <div className="h-8"></div> {/* Spacer for 8th row */}
              <Button type="button" variant="outline" className="w-1/3 h-8 text-xs">Remove all approvers</Button>
              <div className="h-8"></div> {/* Spacer for 10th row */}
              <div className="h-8"></div> {/* Spacer for 11th row */}
              <Input id="to" name="to" value={formData.to} onChange={handleInputChange} className="w-full h-8 text-xs" />
              <div className="h-8"></div> {/* Spacer for 12th row */}
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
    </div>
  )
}