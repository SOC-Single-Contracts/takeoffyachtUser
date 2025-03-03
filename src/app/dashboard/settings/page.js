"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  ArrowRightLeft,
  ChevronRight,
  LogOut,
  ShoppingCart,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchWishlist } from "@/api/wishlist";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Loading } from "@/components/ui/loading";

const Settings = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const loadWishlist = async () => {
      if (session?.user?.userid) {
        try {
          const wishlistItems = await fetchWishlist(session.user.userid);
          setCartCount(wishlistItems.length);
        } catch (error) {
          console.error('Failed to load wishlist:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load wishlist",
          });
        }
      }
    };

    loadWishlist();
  }, [session, toast]);

  const handleLogout = async () => {
    try {
      if (session?.accessToken) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/Auth/logout/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
      }

      await signOut({ 
        redirect: true,
        callbackUrl: "/login"
      });

      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong while logging out",
      });
      await signOut({ 
        redirect: true,
        callbackUrl: "/login"
      });
    }
  };

  // If session is still loading, show a loading state
  if (status === 'loading') {
    return <Loading />
  }

  return (
    <section className="py-6 px-2">
      <div className="max-w-5xl px-2 mx-auto flex items-center space-x-4">
        <Button 
          onClick={() => router.back()} 
          className="bg-[#F8F8F8] hover:bg-[#F8F8F8] shadow-md rounded-full flex items-center justify-center w-10 h-10"
        >
          <ArrowLeft className="w-4 h-4 text-black" />
        </Button>
        <h1 className="text-sm md:text-lg font-medium">My Profile</h1>
      </div>
      <div className="max-w-5xl px-2 mx-auto my-6">
        <Accordion className="space-y-4" type="single" collapsible>
          <AccordionItem className="" value="item-1">
            <AccordionTrigger className="w-full flex justify-start font-semibold items-center hover:no-underline">
              <div className="flex items-center">
                {/* <Image class="w-16 h-16 rounded-full mr-3" src="https://loremflickr.com/320/320/girl" alt="jane" /> */}
                <User className="w-14 h-14 rounded-full mr-3" />
                <div className="text-md space-y-1">
                  <h6 className="font-medium leading-none text-gray-900 hover:text-indigo-600 dark:text-gray-100 transition duration-500 ease-in-out">
                  {session?.user?.username || "Guest"}
                  </h6>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{session?.user?.email || "No email available"}</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="mt-4">
              <section>
                <h2 className="text-lg font-semibold uppercase">General</h2>
                <div>
                  <Link href="/dashboard/cart">
                  <div className="flex justify-between items-center my-3">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="size-6" />
                      <p className="text-gray-700 dark:text-white font-medium text-sm">
                        My Wishlist
                      </p>
                      <Badge className="bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium ml-2">
                        {cartCount}
                      </Badge>
                    </div>
                    <Button className="bg-transparent hover:bg-transparent shadow-none text-black font-medium">
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                  </Link>
                </div>
                <div>
                  <div className="flex justify-between items-center my-3">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 dark:text-white font-medium text-sm">
                        Edit Profile
                      </p>
                    </div>
                    <Button className="bg-transparent hover:bg-transparent shadow-none text-black font-medium">
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
                {/* <div>
                  <div className="flex justify-between items-center my-3">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-medium text-sm">
                        Partner Discounts
                      </p>
                    </div>
                    <Button className="bg-transparent hover:bg-transparent shadow-none text-black font-medium">
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div> */}
                {/* <div>
                  <div className="flex justify-between items-center my-3">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-medium text-sm">
                        My Wallet
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-semibold text-sm">
                        AED 500
                      </p>
                      <Button className="bg-transparent hover:bg-transparent shadow-none text-black font-medium">
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div> */}
                {/* <div>
                  <div className="flex justify-between items-center my-3">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-medium text-sm">
                        Push Notifications
                      </p>
                    </div>
                    <div className="flex items-center gap-2 py-1">
                      <Switch
                        className="data-[state=checked]:bg-[#BEA355] data-[state=unchecked]:bg-[#435269] mr-4"
                        id="airplane-mode"
                      />
                    </div>
                  </div>
                </div> */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h2 className="text-lg font-medium">Appearance</h2>
                    <p className="text-sm text-muted-foreground">
                      Customize the appearance of the app. Automatically switch between day and night themes.
                    </p>
                  </div>
                  <ModeToggle />
                </div>
              </section>
              {/* <Separator className="my-2" />
              <section>
                <h2 className="text-lg font-semibold uppercase">referrals</h2>
                <div>
                  <div className="flex justify-between items-center my-3">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-medium text-sm">
                        Refer a Host
                      </p>
                    </div>
                    <Button className="bg-transparent hover:bg-transparent shadow-none text-black font-medium">
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </section>
              <Separator className="my-2" /> */}
              {/* <section>
                <h2 className="text-lg font-semibold uppercase">hosting</h2>
                <div>
                  <div className="flex justify-between items-center my-3">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-medium text-sm">
                        List your space
                      </p>
                    </div>
                    <Button className="bg-transparent hover:bg-transparent shadow-none text-black font-medium">
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center my-3">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-medium text-sm">
                        Your guidebooks
                      </p>
                    </div>
                    <Button className="bg-transparent hover:bg-transparent shadow-none text-black font-medium">
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </section>
              <Separator className="my-2" />
              <section>
                <h2 className="text-lg font-semibold uppercase">App</h2>
                <div className="bg-[#BEA355]/20 px-2">
                  <div className="flex justify-between items-center my-3">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-medium text-sm">
                        Translation
                      </p>
                    </div>
                    <Button className="bg-transparent hover:bg-transparent shadow-none text-black font-medium">
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center my-3">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-medium text-sm">
                        Give us your feedback
                      </p>
                    </div>
                    <Button className="bg-transparent hover:bg-transparent shadow-none text-black font-medium">
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center my-3">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-medium text-sm">
                        About Us
                      </p>
                    </div>
                    <Button className="bg-transparent hover:bg-transparent shadow-none text-black font-medium">
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center my-3">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-medium text-sm">
                        Currency
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-semibold text-sm">
                        UAE Dirham
                      </p>
                      <Button className="bg-transparent hover:bg-transparent shadow-none text-black font-medium">
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center my-3">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-medium text-sm">
                        Language
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-semibold text-sm">
                        English
                      </p>
                      <Button className="bg-transparent hover:bg-transparent shadow-none text-black font-medium">
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
              <Separator className="my-2" />
              <section>
                <h2 className="text-lg font-semibold uppercase">legal</h2>
                <div>
                  <div className="flex justify-between items-center my-3">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-medium text-sm">
                        Terms & Conditions
                      </p>
                    </div>
                    <Button className="bg-transparent hover:bg-transparent shadow-none text-black font-medium">
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center my-3">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-medium text-sm">
                        Privacy Policy
                      </p>
                    </div>
                    <Button className="bg-transparent hover:bg-transparent shadow-none text-black font-medium">
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center my-3">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-medium text-sm">
                        Open source licenses
                      </p>
                    </div>
                    <Button className="bg-transparent hover:bg-transparent shadow-none text-black font-medium">
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </section> */}
              <Separator className="my-2" />
              <div className="flex justify-center flex-col space-y-4 my-4 items-center w-full max-w-xs mx-auto">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="rounded-md px-4 py-2 w-full h-12 text-[#FF3A30] hover:bg-red-50 hover:text-red-600 transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
                >
                  Logout
                  <LogOut className="size-4" />
                </Button>
                <p className="text-gray-800 font-semibold text-sm pb-4">
                  App V1.10
                </p>
                <Button className="rounded-full px-8 py-2 h-10">
                  <ArrowRightLeft className="size-4" />
                  Switch to hosting
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default Settings;
