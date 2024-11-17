'use client'
import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { getIcon } from '@/pages/icon/icon'
import { workflowItems } from '@/lib/store/selectors/workflow'
import { useRecoilValue } from 'recoil'

ChartJS.register(ArcElement, Tooltip, Legend)

interface WorkflowCardProps {
  setWorkflowVisible: React.Dispatch<React.SetStateAction<boolean>>
}


export default function Cardsworkflow({ setWorkflowVisible }: WorkflowCardProps) {
  
  const workflows = useRecoilValue(workflowItems);

  const onTimeCount = workflows.filter(
    (workflow) => workflow.status === 'on time'
  ).length;
  const stoppedCount = workflows.filter(
    (workflow) => workflow.status === 'stopped'
  ).length;

  const chartData = useMemo(() => {

    return {
      labels: ['On time', 'Stopped'],
      datasets: [
        {
          data: [onTimeCount, stoppedCount],
          backgroundColor: ['#3b82f6', '#ef4444'],
          borderColor: ['#3b82f6', '#ef4444'],
          borderWidth: 1,
        },
      ],
    };
  }, [workflows]);

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
    <Card className="row-span-2 rounded-none overflow-hidden">
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
                    <Doughnut data={chartData} options={options} className="cursor-pointer" />
                      <div className="absolute inset-0 flex  items-center justify-center rounded-full ">
                          <div className="text-center cursor-pointer">
                            <div className="text-2xl font-bold">{workflows.length}</div>
                            <div className="text-xs text-muted-foreground">Total</div>
                          </div>
                      </div>
                    </div>
                </div>
                <div>
                  {onTimeCount > 0 && <div className=" flex justify-center mr-8 ml-8 items-center text-sm text-gray-300 gap-2">
                      <span className="text-lg text-blue-300 cursor-pointer">{onTimeCount}</span>
                      <span className="text-xs cursor-pointer" onClick={()=> setWorkflowVisible(true)}>On time</span>
                  </div>}
                  {stoppedCount > 0 && <div className=" flex justify-center mr-8 ml-8 items-center text-sm text-gray-300 gap-2">
                      <span className="text-lg text-red-600 cursor-pointer">{stoppedCount}</span>
                      <span className="text-xs cursor-pointer" onClick={()=> setWorkflowVisible(true)}>Stopped</span>
                  </div>}
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