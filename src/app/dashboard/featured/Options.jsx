"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-full"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </div>
);

const Options = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Get user ID, default to 1 if not available
  const userId = session?.user?.userid || 1;

  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, 'EEE, MMM d'),
      });
    }
    return dates;
  };

  const tabsData = getDates();

  const fetchExperiences = async (date) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please login to view experiences",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('created_on', date);
      // formData.append('created_on', "2025-04-10");

      

      const response = await fetch('https://api.takeoffyachts.com/yacht/check_experience/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.error_code === "pass") {
        const validExperiences = data.data.filter(item => 
          item.experience && item.experience.name !== null && item.experience.status === true
        );
        setExperiences(validExperiences);
        
        if (validExperiences.length === 0) {
          toast({
            title: "No experiences available",
            description: `No experiences found for ${format(new Date(date), 'MMMM d, yyyy')}`,
            variant: "default",
          });
        }
      } else {
        throw new Error(data.error || 'Failed to fetch experiences');
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences(selectedDate);
  }, [userId]);

  const handleTabChange = (date) => {
    setSelectedDate(date);
    fetchExperiences(date);
  };

  // if (!session) {
  //   return (
  //     <div className="text-center p-8">
  //       <p>Please login to view experience availability</p>
  //       <Button 
  //         className="mt-4 bg-[#BEA355]"
  //         onClick={() => router.push('/login')}
  //       >
  //         Login
  //       </Button>
  //     </div>
  //   );
  // }

  return (
    <Tabs 
      value={selectedDate}
      onValueChange={handleTabChange}
      className="max-w-5xl mx-auto py-10 px-2"
    >
      <TabsList className="grid h-full w-full grid-cols-2 sm:grid-cols-2 md:grid-cols-7 lg:grid-cols-7 max-w-5xl mx-auto">
        {tabsData.map((tab) => (
          <TabsTrigger 
            key={tab.value} 
            value={tab.value}
            className={selectedDate === tab.value ? "bg-[#BEA355] text-white" : ""}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value={selectedDate}>
        {loading ? (
          <div className="animate-pulse">
            <Table>
              <TableHeader className="bg-[#F4F0E4] hover:bg-[#F4F0E4] rounded-t-lg">
                <TableRow>
                  <TableHead className="font-medium text-black">Experience Name</TableHead>
                  <TableHead className="font-medium text-black">Location</TableHead>
                  <TableHead className="font-medium text-black">Duration</TableHead>
                  <TableHead className="font-medium text-black">Guests</TableHead>
                  <TableHead className="font-medium text-black">Price</TableHead>
                  <TableHead className="font-medium text-black">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(3).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><div className="h-4 bg-gray-200 rounded w-3/4"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded w-1/2"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded w-1/4"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded w-1/4"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded w-1/2"></div></TableCell>
                    <TableCell><div className="h-8 bg-gray-200 rounded w-24"></div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <Table>
            <TableHeader className="bg-[#F4F0E4] hover:bg-[#F4F0E4] rounded-t-lg">
              <TableRow>
                <TableHead className="font-semibold text-black">Experience Name</TableHead>
                <TableHead className="font-semibold text-black">Location</TableHead>
                <TableHead className="font-semibold text-black">Duration</TableHead>
                <TableHead className="font-semibold text-black">Guests</TableHead>
                <TableHead className="font-semibold text-black">Price</TableHead>
                <TableHead className="font-semibold text-black">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiences.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No experiences available for this date
                  </TableCell>
                </TableRow>
              ) : (
                experiences.map((item) => (
                  <TableRow key={item.experience.id}>
                    <TableCell className="font-medium text-black">
                      {item.experience.name}
                    </TableCell>
                    <TableCell className="font-medium text-black">
                      {item.experience.location}
                    </TableCell>
                    <TableCell className="font-medium text-black">
                      {`${item.experience.duration_hour}h ${item.experience.duration_minutes}m`}
                    </TableCell>
                    <TableCell className="font-medium text-black">
                      {item.experience.guest}
                    </TableCell>
                    <TableCell className="font-medium text-black">
                      AED {item.experience.min_price?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button 
                        className="bg-[#BEA355] rounded-full text-white"
                        onClick={() => router.push(`/dashboard/experience/${item.experience.id}`)}
                      >
                        Book Now
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default Options;
