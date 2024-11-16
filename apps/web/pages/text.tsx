import WorkflowCard from "@/components/WorkflowCard";
import React from "react"

const text = () => {
  return (
    <div>
      <WorkflowCard onTime={1} stopped={2} />
    </div>
  )
};

export default text;
