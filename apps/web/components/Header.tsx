import React, { useState } from "react"
import { Button } from "./ui/button";
import { HelpCircle, HomeIcon, Search, Star, X } from "lucide-react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useRouter } from "next/router";
import logo from "../public/logo.png";
import Image from "next/image";

const Header = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const toggleSearch = () => setIsSearchVisible(!isSearchVisible)

  const router = useRouter();
  const { pathname } = router;
  const isHome = pathname === '/';

  return (
    <div>
      <header className="h-14 bg-gray-200 border-b flex items-center justify-between px-4">
        <div>
          <Button variant="ghost" size="icon" className="text-gray-600">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Button>
          {!isHome &&
            <Button variant="ghost" size="icon" className="text-gray-600" onClick={() => router.push('/')}>
              <HomeIcon className="h-8 w-8" />
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
            <AvatarFallback className='bg-blue-900'>JM</AvatarFallback>
          </Avatar>
        </div>
      </header>
    </div>
  )
};

export default Header;
