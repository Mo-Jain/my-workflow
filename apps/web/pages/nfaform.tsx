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
import logo from "../public/logo.png";

export default function NFAForm() {
  const [referenceNumber, setReferenceNumber] = React.useState("")

  const generateNumber = () => {
    const number = Math.random().toString(36).substring(7).toUpperCase()
    setReferenceNumber(`REF-${number}`)
  }

  return (
    <div className="min-h-screen py-2"
      style={{
        backgroundColor: 'gray', // Light theme background color
        color: '#171717', // Light theme text color
      }}>
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
            <Label className="text-sm text-center"> 
              Natural Resources
            </Label>
          </div>          
        </div>

        <form className="space-y-8">
          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="workflow-name">
                  Workflow Name <span className="text-red-500">*</span>
                </Label>
                <Input id="workflow-name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">
                  Department <span className="text-red-500">*</span>
                </Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">Information Technology</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adani">Adani Corporation</SelectItem>
                    <SelectItem value="subsidiary">Subsidiary Co.</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site">
                  Site <span className="text-red-500">*</span>
                </Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="site1">Site 1</SelectItem>
                    <SelectItem value="site2">Site 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference">
                  Reference Number <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input 
                    id="reference" 
                    value={referenceNumber} 
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    required 
                  />
                  <Button type="button" variant="outline" onClick={generateNumber}>
                    Generate Number
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sbu">SBU</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select SBU" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sbu1">SBU 1</SelectItem>
                    <SelectItem value="sbu2">SBU 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clause">
                  Clause Number <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Clause" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clause1">Clause 1</SelectItem>
                      <SelectItem value="clause2">Clause 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline">
                    Clear Clause
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workflow-type">
                  Workflow Type <span className="text-red-500">*</span>
                </Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sequential" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sequential">Sequential</SelectItem>
                    <SelectItem value="parallel">Parallel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workflow-role">
                  Multiple Workflow Role <span className="text-red-500">*</span>
                </Label>
                <Textarea 
                  id="workflow-role"
                  required
                  className="min-h-[100px]"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="department-code">Department Code</Label>
                <Input id="department-code" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-code">Company Code</Label>
                <Input id="company-code" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity">Activity</Label>
                <Textarea 
                  id="activity"
                  className="min-h-[200px]"
                />
              </div>

              <Button type="button" variant="outline" className="w-full">
                Remove all approvers
              </Button>
              
            </div>
            
          </div>
          <div className="space-y-2">
            <Label htmlFor="clause">
              DocSet type <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2 w-1/2">
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Clause" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nfa">NFA</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
            
            
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              {/* Left Column */}
              <div>
                <div className="space-y-2">
                    <Label htmlFor="workflow-name">
                      Subject<span className="text-red-500">*</span>
                    </Label>
                    <Input id="workflow-name" required />
                </div>
                <div className="space-y-2 ">
                    <Label htmlFor="workflow-name">
                      Project <span className="text-red-500">*</span>
                    </Label>
                    <Input id="workflow-name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workflow-role">
                    Remarks <span className="text-red-500">*</span>
                  </Label>
                  <Textarea 
                    id="workflow-role"
                    required
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              {/* Right Column */}
              <div className="space-y-2">
                  <Label htmlFor="workflow-name">
                    To <span className="text-red-500">*</span>
                  </Label>
                  <Input id="workflow-name" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clause">
                Final Approval Required? <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2 w-1/2">
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Clause" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nfa">NFA</SelectItem>
                    <SelectItem value="letter">Letter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clause">
                Notification required? <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2 w-1/2">
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Clause" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nfa">NFA</SelectItem>
                    <SelectItem value="letter">Letter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

          <div className="flex justify-start gap-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}