'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { LayoutGrid, ExternalLink } from 'lucide-react'

ChartJS.register(ArcElement, Tooltip, Legend)

interface WorkflowCardProps {
  onTime?: number
  stopped?: number
}

export default function WorkflowCard({ onTime=1, stopped=1 }: WorkflowCardProps) {
  const total = onTime + stopped

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
    <Card className="w-64">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center space-x-2">
            <LayoutGrid className="h-4 w-4" />
            <span>My Workflows</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-36">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
            <div className="text-sm text-muted-foreground">{onTime} On time</div>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
            <div className="text-sm text-muted-foreground">{stopped} Stopped</div>
          </div>
        </div>
        <div className="absolute bottom-2 right-2">
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}