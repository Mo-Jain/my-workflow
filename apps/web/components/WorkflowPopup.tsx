import * as React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Circle, CheckCircle2 } from 'lucide-react'

export default function Component() {
  return (
    <div className="min-h-screen bg-gray-100/40 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-[1fr,300px] gap-4">
          {/* Timeline and Current Step */}
          <div className="space-y-6">
            <div className="relative pl-8">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200" />
              
              {/* Timeline Points */}
              <div className="space-y-8">
                <div className="relative">
                  <Circle className="absolute -left-[27px] h-4 w-4 text-gray-400" />
                  <div className="text-sm text-gray-500">End</div>
                </div>

                <div className="relative">
                  <Circle className="absolute -left-[27px] h-4 w-4 text-gray-400" />
                  <div className="text-sm text-gray-500">Next Step</div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[44px] h-10 w-10 rounded-full bg-blue-500/20">
                    <div className="absolute inset-1 rounded-full bg-blue-500" />
                  </div>
                  <Card className="ml-4">
                    <CardContent className="p-4">
                      <div className="mb-1 font-medium text-blue-600">Current Step</div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">NFA Form - 04/Nov/2...</div>
                          <div className="text-sm text-muted-foreground">Mohit Jain</div>
                        </div>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                          on time
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="relative">
                  <CheckCircle2 className="absolute -left-[27px] h-4 w-4 text-green-500" />
                  <div className="text-sm text-gray-500">Completed Step</div>
                </div>

                <div className="relative">
                  <Circle className="absolute -left-[27px] h-4 w-4 text-gray-400" />
                  <div className="text-sm text-gray-500">Start</div>
                </div>
              </div>
            </div>
          </div>

          {/* Details and Attachments Tabs */}
          <div>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="attachments">
                  Attachments
                  <Badge variant="secondary" className="ml-2 bg-gray-100">
                    1
                  </Badge>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="font-medium">30079647 - NFA WF - 04/Nov/...</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Workflow Due date</div>
                    <div className="font-medium">-</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="font-medium">on time</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Initiator</div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-blue-900 text-white text-xs">
                          MJ
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">Mohit Jain</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Started</div>
                    <div className="font-medium">November 4, 2024</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Workflow-ID</div>
                    <div className="font-medium">11310858</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="attachments" className="mt-4">
                <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <FileText className="h-5 w-5 text-red-500" />
                  <span className="text-sm">NFA for china visit approval.pdf</span>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4">
              <Button className="w-full bg-blue-900 hover:bg-blue-800">
                Stop
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}