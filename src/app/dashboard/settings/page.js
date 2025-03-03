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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { countries } from 'countries-list';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";

const Settings = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [cartCount, setCartCount] = useState(0);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);

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

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`https://api.takeoffyachts.com/Auth/user/details/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserData({
            ID: response.data.ID,
            Auth_ID: response.data.Auth_ID,
            Username: response.data.Username || '',
            Email: response.data.Email || '',
            PhoneNumber: response.data.PhoneNumber || '',
            ProfilePicture: response.data.ProfilePicture || '',
            IsActive: response.data.IsActive,
            IsAdmin: response.data.IsAdmin,
            LastLogin: response.data.LastLogin,
            Bio: response.data.Bio || '',
            DateOfBirth: response.data.DateOfBirth || '',
            Country: response.data.Country || '',
            PreferredLanguage: response.data.PreferredLanguage || '',
            FirstName: response.data.FirstName || '',
            LastName: response.data.LastName || '',
          });
        } catch (error) {
          console.error('Failed to fetch user details:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not load user details',
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [session, toast]);

  const handleUpdateProfile = async (updatedData) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.put(`https://api.takeoffyachts.com/Auth/user/profile/update/`, updatedData, {
          headers:
          {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        });
      } catch (error) {
        console.error('Failed to update profile:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not update profile',
        });
      }
    }
  };

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
  if (status === 'loading' || loading) {
    return <Loading />
  }

  return (
    <>
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
                  {userData.ProfilePicture ? (
                    <Image src={userData.ProfilePicture} alt="Profile" width={40} height={40} className="w-14 h-14 rounded-full mr-3" />
                  ) : (
                    <User className="w-10 h-10 p-1 rounded-full dark:bg-gray-700 bg-white mr-3" />
                  )}
                  <div className="text-md space-y-1">
                    <h6 className="font-medium leading-none text-gray-900 hover:text-indigo-600 dark:text-gray-100 transition duration-500 ease-in-out">
                      {userData.Username || "Guest"}
                    </h6>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {userData.Email || "No email available"}
                    </p>
                    {/* <p className="text-gray-500 dark:text-gray-400 text-sm">
                {userData.PhoneNumber || "No phone number available"}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {userData.FirstName || "No first name available"} {userData.LastName || "No last name available"}
              </p> */}
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
                        <Button className="bg-transparent hover:bg-transparent shadow-none text-black dark:text-white font-medium">
                          <ChevronRight className="size-4" />
                        </Button>
                      </div>
                    </Link>
                  </div>
                  <div className="space-y-4" type="single" collapsible>
                    <div onClick={() => setDialogOpen(true)} className="flex justify-between items-center my-3" >
                      <div className="w-full flex justify-start font-semibold items-center hover:no-underline">
                        <div className="flex items-center">
                          <p className="text-gray-700 dark:text-white font-medium text-base">
                            Edit Profile
                          </p>
                        </div>
                      </div>
                      <Button className="bg-transparent hover:bg-transparent shadow-none text-black dark:text-white font-medium">
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
                    className="rounded-md px-4 py-2 w-full h-12 text-[#FF3A30] hover:bg-red-50 hover:text-red-600 dark:bg-transparent dark:hover:bg-red-50 dark:hover:text-red-600 transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
                  >
                    Logout
                    <LogOut className="size-4" />
                  </Button>
                  <p className="dark:text-white text-gray-800 font-semibold text-sm pb-4">
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
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="dark:bg-gray-800">
          <DialogTitle>Edit Profile</DialogTitle>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(userData); }} className="space-y-4 p-2">
            <div>
              <Label className="text-sm font-semibold">Profile Picture</Label>
              <div className="flex items-center space-x-4">
                {userData.ProfilePicture ? (
                  <Image
                    src={userData.ProfilePicture}
                    alt="Profile"
                    width={50}
                    height={50}
                    className="rounded-full border border-gray-300 shadow-sm object-cover w-12 h-12"
                  />
                ) : (
                  <User className="w-12 h-12 p-1 rounded-full bg-gray-200 border border-gray-300 shadow-sm" />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append('profilePicture', file);
                      setUserData({ ...userData, ProfilePicture: URL.createObjectURL(file) });
                    }
                  }}
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#BEA355]"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold">Username</Label>
              <Input
                required
                type="text"
                value={userData.Username || ''}
                onChange={(e) => setUserData({ ...userData, Username: e.target.value })}
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#BEA355]"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">First Name</Label>
              <Input required type="text" value={userData.FirstName || ''} onChange={(e) => setUserData({ ...userData, FirstName: e.target.value })} className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#BEA355]" />
            </div>
            <div>
              <Label className="text-sm font-semibold">Last Name</Label>
              <Input required type="text" value={userData.LastName || ''} onChange={(e) => setUserData({ ...userData, LastName: e.target.value })} className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#BEA355]" />
            </div>
            <div>
              <Label className="text-sm font-semibold">Email</Label>
              <Input required type="email" value={userData.Email || ''} onChange={(e) => setUserData({ ...userData, Email: e.target.value })} className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#BEA355]" />
            </div>
            <div>
              <Label className="text-sm font-semibold">Phone Number</Label>
              <Input required type="tel" value={userData.PhoneNumber || ''} onChange={(e) => setUserData({ ...userData, PhoneNumber: e.target.value })} className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#BEA355]" />
            </div>
            {/* <div>
                            <Label className="text-sm font-semibold">Bio</Label>
                            <Input type="text" value={userData.Bio || ''} onChange={(e) => setUserData({...userData, Bio: e.target.value})} className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#BEA355]" />
                          </div> */}
            <div>
              <Label className="text-sm font-semibold">Date of Birth</Label>
              <Input type="date" value={userData.DateOfBirth || ''} onChange={(e) => setUserData({ ...userData, DateOfBirth: e.target.value })} className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#BEA355]" />
            </div>
            <div>
              <Label className="text-sm font-semibold">Country</Label>
              <select
                value={userData.Country || ''}
                onChange={(e) => setUserData({ ...userData, Country: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#BEA355]"
              >
                <option value="" disabled>Select your country</option>
                {Object.keys(countries).map((countryCode) => (
                  <option key={countryCode} value={countries[countryCode].name}>
                    {countries[countryCode].name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-sm font-semibold">Preferred Language</Label>
              <Input type="text" value={userData.PreferredLanguage || ''} onChange={(e) => setUserData({ ...userData, PreferredLanguage: e.target.value })} className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#BEA355]" />
            </div>
            <Button type="submit" className="bg-[#BEA355] text-white rounded-full px-6 py-2 hover:bg-[#A78B3A] transition duration-200">Update Profile</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Settings;
