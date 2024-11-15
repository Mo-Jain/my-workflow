import React, { useEffect, useState } from "react"
import { Button } from "./ui/button";
import { AmpersandIcon, Delete, HelpCircle, HomeIcon, LogIn, LogOut, Search, Star, X } from "lucide-react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useRouter, NextRouter } from "next/router";
import logo from "../public/logo.png";
import Image from "next/image";
import { userState } from "@/lib/store/atoms/user";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { userNameState } from "@/lib/store/selectors/user";
import axios from "axios";
import { BASE_URL } from "@/next.config";
import path from "path";

const Header = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const toggleSearch = () => setIsSearchVisible(!isSearchVisible);
  const userName  =  useRecoilValue(userNameState);
  const setUser  = useSetRecoilState(userState);
  const [shortName,setShortName] = useState("")
  const router = useRouter();
  const { pathname } = router;
  const isHome = pathname === '/';

  useEffect(() => {
    const name = userName;
    if(name){
      const nameArray = name.split(" ");
      const temp = ( nameArray[nameArray.length-1][0] + nameArray[0][0]).toUpperCase();
      setShortName(temp);
    }
  },[userName])

  return (
    <div className="h-14 w-full ">
      <header className=" fixed w-full z-40 bg-gray-200 border-b flex items-center justify-between px-4">
        <div>
          <Button variant="ghost" size="icon" className="text-gray-600">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Button>
          {!isHome &&
            <Button variant="ghost" size="icon" className="text-gray-600" onClick={() => router.push('/')}>
              <HomeIcon className="h-5 w-5" />
              <span className="sr-only">Help</span>
            </Button>
          }
        </div>

        <div className={`flex items-center gap-2 transition-opacity duration-300 ${isSearchVisible ? 'opacity-0' : 'opacity-100'}`}>
          <Image 
            src={logo} 
            width={100}
            height={70}
            alt="Adani Natural Resources" 
          />
          <span className="text-gray-600 text-sm">Natural Resources</span>
        </div>

        <div className="flex items-center gap-2">
          { pathname !== '/admin' ? 
          <Button variant="ghost" size="icon" 
            className="text-black bg-green-500 h-10 w-20 flex items-center justify-center"
            onClick={() => router.push('/admin')}
          >
            <span >Admin</span>
          </Button>
          :
          <></>
          }
          <div className={`transition-all duration-300 ${isSearchVisible ? 'w-96' : 'w-0'} overflow-hidden`}>
            <Input 
              type="search" 
              placeholder="Search..." 
              className="h-8"
            />
          </div>
          <Button variant="ghost" size="icon" className="text-gray-600" onClick={toggleSearch}>
            {isSearchVisible ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            <span className="sr-only">{isSearchVisible ? 'Close Search' : 'Search'}</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600">
            <Star className="h-5 w-5" />
            <span className="sr-only">Favorites</span>
          </Button>
          <Avatar className="h-8 w-8 bg-blue-900 text-white">
            <Profile shortName={shortName} name={userName} router={router} setShortName={setShortName}/>
          </Avatar>
        </div>
      </header>
    </div>
  )
};

export default Header;

const Profile = ({shortName, name, router,setShortName}:{
  shortName: string,
  name: string | null,
  router: NextRouter,
  setShortName:React.Dispatch<React.SetStateAction<string>>
}) => {

  const setUser  = useSetRecoilState(userState);
  const userName  =  useRecoilValue(userNameState);
  
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <AvatarFallback className='bg-blue-900'>{shortName}</AvatarFallback>
            <span className="sr-only">{name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Profile</DropdownMenuLabel>
          {name ? 
          <>
            <DropdownMenuItem 
              className=" h-auto cursor-pointer flex justify-center items-center gap-2 rounded-md p-2"

            >
              <AvatarFallback className='bg-blue-900 rounded-full h-8 w-8 text-white'>{shortName}</AvatarFallback>
              <span>{name}</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="bg-gray-100 cursor-pointer flex justify-center items-center gap-2 rounded-md p-2"
              onSelect={() =>{
              localStorage.setItem("token","");
              setUser({
                  isLoading:false,
                  username:null,
                  name:null
              }),
              setShortName("")
              console.log(userName)
              router.push('/auth-page');
            }}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LogOut className="h-4 w-4" />
              <span >Logout</span>
            </Button>
          </DropdownMenuItem>
          </>
          :
          <DropdownMenuItem 
          className="bg-gray-100 cursor-pointer flex justify-center items-center gap-2 rounded-md p-2"
          onSelect={()=> router.push('/auth-page')}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Button>
          </DropdownMenuItem>
          }
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}


