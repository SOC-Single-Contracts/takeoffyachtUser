"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Calendar, Heart, MessageSquare, MoonIcon, Search, User } from 'lucide-react';
import Link from 'next/link';
import { Input } from '../../ui/input';
import { appbarbg, appbarlogo } from '../../../../public/assets/images';

const AppBar = () => {
  return (
    <header className="w-full relative container mx-auto">
    <Image src={appbarbg} alt="Background Image" className="object-contain object-center w-full h-full rounded-b-[2rem]" />
      {/* Navigation Bar */}
      <nav className="absolute top-4 left-0 w-full z-10 px-2">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between bg-black text-white rounded-xl shadow-lg">
          <div className="flex items-center space-x-7">
            <Link href="/dashboard">
              <Image src={appbarlogo} alt="Logo" width={150} height={150} />
            </Link>

            {/* Search Input */}
            <div className="relative">
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full bg-white text-black font-light focus:outline-none"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center lg:space-x-4 space-x-1 lg:ml-0 ml-4">
            <Button variant="ghost" className="text-white capitalize bg-[#BEA355] rounded-full">
              Become A Host
            </Button>

            {/* Wishlist Icon */}
            <Button className="flex items-center justify-center bg-[#BEA355]/30 w-10 h-10 rounded-full text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all">
              <Heart className="w-6 h-6" />
            </Button>

            {/* Calendar Icon */}
            <Button className="flex items-center justify-center bg-[#BEA355]/30 w-10 h-10 rounded-full text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all">
              <Calendar className="w-6 h-6" />
            </Button>

            {/* Chat Icon */}
            <Button className="flex items-center justify-center bg-[#BEA355]/30 w-10 h-10 rounded-full text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all">
              <MessageSquare className="w-6 h-6" />
            </Button>

            {/* Account Icon */}
            <Button className="flex items-center justify-center bg-[#BEA355]/30 w-10 h-10 rounded-full text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all">
              <User className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AppBar;