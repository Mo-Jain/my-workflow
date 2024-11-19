import { ChevronDown, ExternalLink, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import FileManager from "./FileManger"
import { useEffect, useState } from "react"
import { getIcon } from "@/pages/icon/icon"
import { useRouter } from "next/navigation"
import { workflowItems } from "@/lib/store/selectors/workflow"
import { useRecoilValue } from "recoil"
import WorkflowPopup from "./WorkflowPopup"
import { Input } from "./ui/input"
import { Workflow } from "@/lib/store/atoms/workflow"

// Sample data - in a real app this would come from your backend


export default function Component(
  {onClose}:
  {onClose:()=>void}
) {
  const [workflowsList, setWorkflowsList] = useState<Workflow[]>([]);
  const [workflowVisible, setWorkflowVisible] = useState(false);
  const workflows = useRecoilValue(workflowItems);
  const [clickedItem, setClickedItem] = useState<Workflow>();
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });

  useEffect(() => {
    if(!workflows[0]) return;

    setWorkflowsList(workflows);
  }, [workflows]);

  useEffect(() => {
    if(!clickedItem) setWorkflowVisible(false)
  }, [clickedItem])

  const handleSort = (key: string) => {
    // Determine the new sorting direction
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    
    // Sort items based on the key and direction
    const sortedItems = [...workflowsList].sort((a:any, b:any) => {
      const aValue = a[key];
      const bValue = b[key];

      // Handle different data types
      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }
    });

    // Update state with sorted items and new sort configuration
    setWorkflowsList(sortedItems);
    setSortConfig({ key, direction });
  };

  const handleClick = (item:Workflow) => {
    setClickedItem(item)
    setWorkflowVisible(true)
  }

  const headers = [ 'Status', 'Due Date','Workflow Name', 'Current Step', 'Assigned To', 'Start Date'];
  
  return (
    <div className=" bg-background text-black">
      {workflowVisible && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          {/* Translucent overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50 z-30"
          />
          
          {/* Popup content */}
          <div className="relative z-40 bg-white rounded-lg shadow-lg w-max h-[85vh] overflow-hidden  ">
            <WorkflowPopup onClose={()=>setWorkflowVisible(false)} clickedItem={clickedItem} setClickedItem={setClickedItem} />
          </div>
        </div>
      )}
     
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ChevronDown className="h-4 w-4" />
            <h1 className="text-lg font-medium">My Workflows</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>                
                {headers.map((header) => {
                  const isSorted = sortConfig.key === header.toLowerCase();
                  return (
                    <TableHead
                      key={header}
                      className="cursor-pointer items-center gap-2"
                      onClick={() => handleSort(header.toLowerCase())}
                    >
                      {header}
                      <span className="inline-block w-2">
                        {isSorted ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                      </span>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            
            <TableBody>
                { workflowsList.map((item:any) => (
                    <TableRow key={item.id} onClick={()=>handleClick(item)} className="cursor-pointer hover:bg-gray-100">
                        <TableCell  className="items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-2 items-center">
                              <div >{getIcon(item.status,"h-4 w-4")}</div>
                              <span>{item.status}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.dueDate}</TableCell>
                        <TableCell>{item.workflowName}</TableCell>
                        <TableCell className="w-[255px] overflow-hidden text-ellipsis whitespace-nowrap">{item.currentStep}</TableCell>
                        <TableCell>{item.assignedTo}</TableCell>
                        <TableCell>{item.startDate}</TableCell>
                        
                    </TableRow>
                ))}
            </TableBody>
          </Table>
      </div>
    </div>
  )
}
