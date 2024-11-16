'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { getIcon } from '@/pages/icon/icon'
import { workflowItems } from '@/lib/store/selectors/workflow'
import { useRecoilValue } from 'recoil'

ChartJS.register(ArcElement, Tooltip, Legend)

interface WorkflowCardProps {
  onTime?: number
  stopped?: number,
  setWorkflowVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const workflows =[
    {
        "id": "ba604056-5af7-4945-8af8-7ecb24d5a96a",
        "status": "on time",
        "dueDate": null,
        "workflowName": "30079647 - NFA WF - 10/Sep/2024 03:16",
        "currentStep": "NFA Form - 10/Sep/2024 03:16 PM",
        "assignedTo": "Mohit Jain",
        "startDate": "2024-11-15T11:47:55.239Z"
    },
    {
        "id": "ba074564-e84d-423b-84e0-7cd787d897f9",
        "status": "on time",
        "dueDate": null,
        "workflowName": "30079647 - NFA WF - 10/Sep/2024 03:16",
        "currentStep": "NFA WF - 10/Sep/2024 03:16",
        "assignedTo": "Mohit Jain",
        "startDate": "2024-11-15T14:33:10.774Z"
    }
]



export default function Cardsworkflow({ onTime=1, stopped=1,setWorkflowVisible }: WorkflowCardProps) {
  const total = onTime + stopped
  const workflows = useRecoilValue(workflowItems);
  
  const data = {
    labels: ['On time', 'Stopped'],
    datasets: [
      {
        data: [onTime, stopped],
        backgroundColor: ['#3b82f6', '#ef4444'],
        borderColor: ['#3b82f6', '#ef4444'],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  }

  return (
    <Card className="row-span-2 rounded-none">
            <CardHeader 
              className="flex flex-row items-center gap-2 border-b h-1/6 cursor-pointer hover:bg-gray-100"
              onClick={()=>setWorkflowVisible(true)}>
              {getIcon('workflow',"h-8")}
              <CardTitle className="text-sm font-medium">My Workflows</CardTitle>
            </CardHeader>
              <CardContent className="h-[calc(100%-3rem)]  flex bg-gray-800 text-white flex-col items-center p-2 text-muted-foreground">
              {workflows.length > 1 ?
                <div className="flex h-full w-full items-center justify-center gap-2">
                <div className=" h-36 w-36 rounded-full cursor-default">
                    <div className=" relative rounded-full">
                    <Doughnut data={data} options={options} className="cursor-pointer" />
                    <div className="absolute inset-0 flex  items-center justify-center rounded-full ">
                        <div className="text-center">
                        <div className="text-2xl font-bold">{workflows.length}</div>
                        <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className=" flex justify-center mr-8 ml-8 items-center text-sm text-gray-300 gap-2">
                    <span className="text-lg text-blue-300 cursor-pointer">{workflows.length}</span>
                    <span className="text-xs cursor-pointer" onClick={()=> setWorkflowVisible(true)}>On time</span>
                </div>
                </div>
                :
                <div>
                {workflows[0] && 
                  <> 
                    <div className="flex items-center justify-center gap-6 mb-2">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={()=> setWorkflowVisible(true)}>
                        <span className="text-xl">1</span>
                        <span className="text-gray-400 text-xl">Total</span>
                      </div>
                      <div className="flex items-center gap-2 cursor-pointer" onClick={()=> setWorkflowVisible(true)}>
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-white text-xl">{workflows[0].status}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-gray-400 text-base">Workflow name</div>
                        <div className="text-sm text-white font-semi-bold">{workflows[0].workflowName}</div>
                      </div>
                      
                      <div>
                        <div className="text-gray-400 text-base">Current step</div>
                        <div className="text-sm text-white font-semi-bold">{workflows[0].currentStep}</div>
                      </div>
                      
                      <div className="flex justify-between">
                        <div>
                          <div className="text-gray-400 text-base">Assigned to</div>
                          <div className="text-sm text-white font-semi-bold">{workflows[0].assignedTo}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-base">Start date</div>
                          <div className="text-sm text-white font-semi-bold">{new Date(workflows[0].startDate).toLocaleString('default', { month: 'long' })+ " "+new Date(workflows[0].startDate).getDate()+ ", " +new Date(workflows[0].startDate).getFullYear()}</div>
                        </div>
                      </div>
                    </div>
                  </>}
                  </div>
                  }
      </CardContent>
    </Card>
  )
}