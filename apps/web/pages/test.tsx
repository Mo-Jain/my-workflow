import WorkflowCard from "@/components/WorkflowCard";
import WorkflowPopup from "@/components/WorkflowPopup";
import React from "react"

const text = () => {
  return (
    <div>
      <div className="relative z-40 bg-white rounded-lg shadow-lg w-max h-[85vh] overflow-y-auto  ">
        <WorkflowPopup />
      </div>
    </div>
  )
};

export default text;
