import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/next.config";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import axios from "axios";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface User {
  id: number;
  username: string;
  name: string; 
}
export interface Approver {
    id: string;
    name: string;
    step: string;
}
  



export const InputSearchApprover = (
    {approvers,
     setApprovers,
     className
    }:
    {approvers:Approver[],
     setApprovers:React.Dispatch<React.SetStateAction<Approver[]>>,
    className?:string
    }
    ) => {
  const [isFocus, setIsFocus] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const [users, setUsers] = useState<User[]>([])
    
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])

  useEffect(() => {
    if (isFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocus])

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(`${BASE_URL}/api/v1/users/all`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setUsers(res.data.userData)
    }
    fetchData()
  }, [])

 

  function addApprover(user: User) {
    const newApprover: Approver = {
      id: user.id.toString(),
      name: user.name,
      step: `flexi-flow approval`,
    }
    setApprovers([...approvers, newApprover])
    setSearchTerm("")
  }

  function getShortName(name: string) {
    const nameArray = name.split(" ");
    const temp = ( nameArray[nameArray.length-1][0] + nameArray[0][0]).toUpperCase();
    return temp;
  }
  return (
    <div>
        <div className={`flex bg-white rounded cursor-text relative ${className}`}>
          <div className="w-[5px] rounded-l bg-white"></div>
          <input
            type="text"
            ref={inputRef}
            className="focus:outline-none text-black p-1 w-full"
            onFocus={() => setIsFocus(true)}
            onBlur={() => setTimeout(() => setIsFocus(false), 200)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className={"p-1 flex items-center justify-center"} onClick={() => setIsFocus(true)}>
            <Search className={`w-4 h-4  ${isFocus ? "text-gray-400" : "text-gray-800"}`} />
          </div>
          { searchTerm && (
            <div className=" text-black bg-gray-100 absolute top-full left-0 mt-1 shadow-md overflow-y-auto z-10">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-2 hover:bg-gray-100 gap-0 flex cursor-pointer bg-gray-200 h-[80px]"  
                  onClick={() => addApprover(user)}
                >
                  <div className="flex items-center h-full p-2">
                    <Avatar className=" h-8 w-8 bg-blue-900 rounded-full text-white">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <AvatarFallback className='bg-blue-900 rounded-full'>{getShortName(user.name)}</AvatarFallback>
                        <span className="sr-only">{user.name}</span>
                      </Button>
                    </Avatar>
                  </div>
                  <div className="flex flex-col items-center justify-around p-2">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.username}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      
    </div>
  )
};

export const ApproverField = (
    {approvers,
     setApprovers,
     className
    }:
    {approvers:Approver[],
     setApprovers:React.Dispatch<React.SetStateAction<Approver[]>>,
    className?:string
    }
    ) => {
     function removeApprover(id: string) {
        const newApprovers = approvers.filter((approver) => approver.id !== id)
        setApprovers(newApprovers)
    }
    return (
        <div className={` ${className} p-3 flex flex-wrap bg-white text-black text-center rounded`}>
          {approvers.map((approver, index) => (
            <div className="bg-gray-300 rounded flex items-center px-1 mr-1 mb-1 flex w-fit h-fit" key={index}>
              <span className="text-sm">{approver.name}</span>
              <div className="text-lg rotate-45 px-1 cursor-pointer" onClick={() => removeApprover(approver.id)}>
                +
              </div>
            </div>
          ))}
        </div>
    )
}
