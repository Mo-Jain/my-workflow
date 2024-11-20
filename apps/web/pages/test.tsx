import { ApproverField, InputSearchApprover } from "@/components/SearchApprover"
import { Input } from "@/components/ui/input"
import { useState } from "react"


  interface Approver {
    id: string;
    name: string;
    step: string;
  }

export default function Component() {
 
  const [isOpen, setIsOpen] = useState(true)
  const [approvers, setApprovers] = useState<Approver[]>([]);

  return (
    <div>
      <h1 onClick={() => setIsOpen(true)}>test</h1>
      <div className="flex mt-10 flex-col gap-2 justify-center items-center">
        <InputSearchApprover approvers={approvers} setApprovers={setApprovers} />
        <ApproverField approvers={approvers} setApprovers={setApprovers} />
      </div>
    </div>
  )
}