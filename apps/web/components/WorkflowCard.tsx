"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PolarGrid, RadialBar, RadialBarChart } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"


interface WorkflowStatusProps {
  onTime?: number
  stopped?: number
}
const COLORS = ["hsl(var(--primary))", "hsl(var(--destructive))"]
export default function Component({ onTime = 1, stopped = 1 }: WorkflowStatusProps) {
  const total = onTime + stopped
  
  const data = [
    {
      name: "On time",
      value: onTime,
      fill: "hsl(var(--primary))"
    },
    {
      name: "Stopped",
      value: stopped,
      fill: "hsl(var(--destructive))"
    }
  ]
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]
   
  const chartConfig = {
    desktop: {
      label: "On time",
      color: "#2563eb",
    },
    mobile: {
      label: "Stopped",
      color: "#60a5fa",
    },
  } satisfies ChartConfig

  return (
    <Card className="w-[300px] bg-muted/40">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <div className="rounded bg-background/80 p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 7h10" />
            <path d="M7 12h10" />
            <path d="M7 17h10" />
          </svg>
        </div>
        <CardTitle>My Workflows</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="relative aspect-square">
         <ChartContainer 
          className="mx-auto w-full max-w-xs"
          config={chartConfig}>
            <RadialBarChart
              data={data}
              innerRadius="60%"
              outerRadius="100%"
              startAngle={180}
              endAngle={-180}
            >
              <PolarGrid radialLines={false} />
              <RadialBar
                background
                dataKey="value"
                cornerRadius={0}
                
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground font-bold text-2xl"
              >
                {total}
              </text>
              <text
                x="50%"
                y="65%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-sm"
              >
                Total
              </text>
            </RadialBarChart>
          </ChartContainer>
          <div className="absolute bottom-0 right-0 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-primary" />
              <span className="text-sm">
                {onTime} On time
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-destructive" />
              <span className="text-sm">
                {stopped} Stopped
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}