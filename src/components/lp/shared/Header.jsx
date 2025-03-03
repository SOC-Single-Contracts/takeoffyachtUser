"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Calendar,
  CalendarClock,
  CircleUserRound,
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  MessageSquareText,
  Search,
  Ship,
  SquareArrowOutUpRight,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SearchFilter from "./SearchFilter";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { signOut } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [openSheet, setOpenSheet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState({});
  const [location, setLocation] = useState('');
  const [guest, setGuest] = useState('1');
  const [selectedDate, setSelectedDate] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = async () => {
    setIsLoading(false);
    try {
      const searchParams = {
        location: location,
        date: selectedDate,
        guests: guest
      };

      const currentRoute = router.pathname || '/';

      if (currentRoute === '/') {
        const [eventResponse, yachtResponse, anotherResponse] = await Promise.all([
          fetch('https://api.takeoffyachts.com/yacht/check_event/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ user_id: 1 || '', ...searchParams })
          }),
          fetch('https://api.takeoffyachts.com/yacht/check_yacht/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ user_id: 1 || '', ...searchParams })
          }),
          fetch('https://api.takeoffyachts.com/yacht/check_experience/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ user_id: 1 || '', ...searchParams })
          })
        ]);

        const eventData = await eventResponse.json();
        const yachtData = await yachtResponse.json();
        const anotherData = await anotherResponse.json();

        setSearchResults({
          events: eventData.data,
          yachts: yachtData.data,
          another: anotherData.data
        });
      } else if (currentRoute.startsWith('/dashboard/events')) {
        const response = await fetch('https://api.takeoffyachts.com/yacht/check_event/', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ user_id: session?.user?.userid || '', ...searchParams })
        });
        const data = await response.json();
        setSearchResults(data.data);
      } else if (currentRoute.startsWith('/dashboard/experience')) {
        const response = await fetch('https://api.takeoffyachts.com/yacht/check_experience/', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ user_id: session?.user?.userid || '', ...searchParams })
        });
        const data = await response.json();
        setSearchResults(data.data);
      } else if (currentRoute.startsWith('/dashboard/yachts')) {
        const response = await fetch('https://api.takeoffyachts.com/yacht/check_yachts/', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ user_id: session?.user?.userid || '', ...searchParams })
        });
        const data = await response.json();
        setSearchResults(data.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    signOut({ 
      callbackUrl: '/login',
      redirect: true 
    });
  };

  return (
    <nav className={`
      backdrop-blur-2xl 
      fixed top-0 left-0 right-0 z-50 
      ${scrolled 
        ? 'bg-white/0 backdrop-blur-2xl' 
        : 'bg-[#E2E2E2]/100 dark:bg-[#E2E2E2]/0 backdrop-blur-xl'}
      transition-all duration-300 ease-in-out
    `}>
      <div className="max-w-5xl mx-auto flex items-center justify-between px-2 py-4">
          <Link href="/">
            <Image
              src="/assets/images/logo.png"
              width={180}
              height={100}
              quality={100}
              className="w-full lg:max-w-[160px] md:max-w-[160px] max-w-[140px] dark:hidden block"
              alt="Logo"
              priority
            />
            <Image
              src="/assets/images/logo.png"
              width={180}
              height={100}
              quality={100}
              className="w-full md:max-w-[160px] sm:max-w-[140px] max-w-[125px] dark:block hidden"
              alt="Logo"
              priority
            />
          </Link>
          <div className="hidden md:block">
          <SearchFilter />
          </div>
          <div className="flex items-center space-x-2">
            <ModeToggle />
            <div className="hidden md:block">
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger asChild>
                    <Button variant="primary" className="rounded-full bg-[#91908b] flex items-center text-white space-x-2 cursor-pointer">
                      <Menu className="w-6 h-6" />
                      <span>Menu</span>
                    </Button>
                  </MenubarTrigger>
                  <MenubarContent>
                    <Link href="/dashboard/cart">
                      <MenubarItem>
                        <Heart className="w-4 h-4 mr-2" />
                        Wishlist
                      </MenubarItem>
                    </Link>
                    <MenubarItem>
                      <Link className="flex items-center space-x-2" href="/dashboard/all-bookings">
                        <Calendar className="w-4 h-4 mr-2" />
                        Bookings
                      </Link>
                    </MenubarItem>
                    <MenubarItem>
                      <Link className="flex items-center space-x-2" href="/dashboard/messages">
                        <MessageSquareText className="w-4 h-4 mr-2" />
                        Messages
                      </Link>
                    </MenubarItem>
                    <MenubarItem>
                      <Link className="flex items-center space-x-2" href="/dashboard/wallet">
                        <Wallet className="w-4 h-4 mr-2" />
                        Wallet
                      </Link>
                    </MenubarItem>
                    <MenubarItem>
                      <Link className="flex items-center space-x-2" href="/dashboard/settings">
                        <CircleUserRound className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </MenubarItem>
                    <Separator />
                    <MenubarItem>
                      {/* <MenubarSubTrigger className="flex items-center"> */}
                      <Link className="flex items-center space-x-2" href="/dashboard/yachts">
                        <Ship className="w-4 h-4 mr-2" />
                        Yachts
                      </Link>
                      {/* </MenubarSubTrigger> */}
                      {/* <MenubarSubContent>
                        <MenubarItem>
                          <Link href="/dashboard/yachts">Regular Yachts</Link>
                        </MenubarItem>
                        <MenubarItem>
                          <Link href="/dashboard/yachts">F1 Yachts</Link>
                        </MenubarItem>
                        <MenubarItem>
                          <Link href="/dashboard/yachts">New Year Eve Yachts</Link>
                        </MenubarItem>
                      </MenubarSubContent> */}
                    </MenubarItem>
                    <MenubarItem>
                      <Link className="flex items-center space-x-2" href="/dashboard/experience">
                        <SquareArrowOutUpRight className="w-4 h-4 mr-2" />
                        Experiences
                      </Link>
                    </MenubarItem>
                    <MenubarItem>
                      <Link className="flex items-center space-x-2" href="/dashboard/events">
                        <CalendarClock className="w-4 h-4 mr-2" />
                        Events
                      </Link>
                    </MenubarItem>
                    <Separator />
                    <MenubarItem>
                      <Link className="flex items-center space-x-2" href="/merchant/dashboard">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Merchant Dashboard
                      </Link>
                    </MenubarItem>
                    {session && (
                      <MenubarItem>
                        <div 
                          onClick={handleLogout} 
                          className="flex items-center space-x-2 cursor-pointer text-red-500 hover:text-red-600"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </div>
                      </MenubarItem>
                    )}
                    {!session && (
                      <MenubarItem>
                        <Link className="flex items-center space-x-2" href="/login">
                          <LogIn className="w-4 h-4 mr-2" />
                          Login / Signup
                        </Link>
                      </MenubarItem>
                    )}
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
            <div className="md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button className="rounded-full flex items-center space-x-2 cursor-pointer">
                    <Menu className="w-6 h-6" />
                    <span>Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-4 w-full" >
                  <SheetHeader className="text-start">
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 mb-6">
                    <SearchFilter />
                  </div>
                  <div className="flex flex-col space-y-4">
                    {/* <Link
                      href="/where"
                      className="flex items-center space-x-2 text-gray-700 hover:text-black dark:text-gray-300"
                    >
                      <Heart className="w-4 h-4" /> <span>Where?</span>
                    </Link>
                    <Link
                      href="/when"
                      className="flex items-center space-x-2 text-gray-700 hover:text-black dark:text-gray-300"
                    >
                      <Calendar className="w-4 h-4" /> <span>When?</span>
                    </Link>
                    <Link
                      href="/who"
                      className="flex items-center space-x-2 text-gray-700 hover:text-black dark:text-gray-300"
                    >
                      <CircleUserRound className="w-4 h-4" /> <span>Who?</span>
                    </Link>
                    <Separator /> */}
                    <Link
                      href="/dashboard/cart"
                      className="flex items-center space-x-2 text-gray-700 hover:text-black dark:text-gray-300"
                    >
                      <Heart className="w-4 h-4" /> <span>Wishlist</span>
                    </Link>
                    <Link
                      href="/dashboard/all-bookings"
                      className="flex items-center space-x-2 text-gray-700 hover:text-black dark:text-gray-300"
                    >
                      <Calendar className="w-4 h-4" /> <span>Bookings</span>
                    </Link>
                    <Link
                      href="/dashboard/messages"
                      className="flex items-center space-x-2 text-gray-700 hover:text-black dark:text-gray-300"
                    >
                      <MessageSquareText className="w-4 h-4" /> <span>Messages</span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center space-x-2 text-gray-700 hover:text-black dark:text-gray-300"
                    >
                      <CircleUserRound className="w-4 h-4" /> <span>Profile</span>
                    </Link>
                    <Link
                      href="/dashboard/wallet"
                      className="flex items-center space-x-2 text-gray-700 hover:text-black dark:text-gray-300"
                    >
                      <Wallet className="w-4 h-4" /> <span>Wallet</span>
                    </Link>
                    
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                        <Ship className="w-4 h-4" /> <span>Yachts</span>
                      </div>
                      <div className="pl-6 space-y-2">
                        <Link
                          href="/dashboard/yachts"
                          className="block text-gray-700 hover:text-black dark:text-gray-300"
                        >
                          Regular Yachts
                        </Link>
                        <Link
                          href="/dashboard/yachts"
                          className="block text-gray-700 hover:text-black dark:text-gray-300"
                        >
                          F1 Yachts
                        </Link>
                        <Link
                          href="/dashboard/yachts"
                          className="block text-gray-700 hover:text-black dark:text-gray-300"
                        >
                          New Year Eve Yachts
                        </Link>
                      </div>
                    </div>
                    <Link
                      href="/dashboard/experience"
                      className="flex items-center space-x-2 text-gray-700 hover:text-black dark:text-gray-300"
                    >
                      <SquareArrowOutUpRight className="w-4 h-4" /> <span>Experiences</span>
                    </Link>
                    <Link
                      href="/dashboard/events"
                      className="flex items-center space-x-2 text-gray-700 hover:text-black dark:text-gray-300"
                    >
                      <CalendarClock className="w-4 h-4" /> <span>Events</span>
                    </Link>
                    <Separator />
                    <Link
                      href="/merchant/dashboard"
                      className="flex items-center space-x-2 text-gray-700 hover:text-black dark:text-gray-300"
                    >
                      <LayoutDashboard className="w-4 h-4" /> <span>Merchant Dashboard</span>
                    </Link>
                    {session && (
                      <button
                        className="flex items-center space-x-2 text-gray-700 hover:text-black dark:text-gray-300 text-red-500"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" /> <span>Logout</span>
                      </button>
                    )}
                    {!session && (
                      <Link
                        href="/login"
                        className="flex items-center space-x-2 text-gray-700 hover:text-black dark:text-gray-300"
                      >
                        <LogIn className="w-4 h-4" /> <span>Login / Signup</span>
                      </Link>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
      </div>
    </nav>
  );
};

export default Header;
