"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import BookingWizard from './BookingWizard';
import { Loading } from '@/components/ui/loading';

const BookingPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    date: new Date(),
    seats: 1,
    duration_hour: 1,
    total_cost: 0,
    paid_cost: 0,
  });

  // Authentication and redirection effect
  useEffect(() => {
    if (status === 'unauthenticated') {
      toast({
        title: "Login Required",
        description: "You need to be logged in to book an experience",
        variant: "destructive"
      });
      router.push('/login');
    }
  }, [status, toast, router]);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.takeoffyachts.com'}/yacht/get_experience/1`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch experience');
        }

        const data = await response.json();
        if (data.error_code === "pass" && data.data?.length > 0) {
          const experienceData = data.data.find(item => item.experience.id.toString() === id);
          if (experienceData) {
            setExperience(experienceData);
            setBookingData(prev => ({
              ...prev,
              total_cost: experienceData.experience.min_price,
              paid_cost: experienceData.experience.min_price
            }));
          } else {
            throw new Error('Experience not found');
          }
        } else {
          throw new Error(data.data || 'Failed to fetch experience data');
        }
      } catch (error) {
        console.error('Error fetching experience:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if authenticated and session is fully loaded
    if (status === 'authenticated' && session?.user?.userid && id) {
      fetchExperience();
    }
  }, [id, session, status, toast]);

  // Show loading while checking session
  if (status === 'loading' || loading) {
    return <Loading />;
  }

  // Prevent rendering if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.takeoffyachts.com'}/yacht/experience_booking/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          experiencedb: parseInt(id),
          user_id: session.user.userid,
          ...bookingData,
          date: format(bookingData.date, 'yyyy-MM-dd'),
        }),
      });

      const data = await response.json();

      if (response.ok && data.error_code === "pass") {
        router.push('/dashboard/all-bookings');
      } else {
        throw new Error(data.data || 'Booking failed');
      }
    } catch (error) {
      console.error('Error making booking:', error);
      toast({
        title: "Booking Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Select Date and Details</h2>
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={bookingData.date}
                onSelect={(date) => setBookingData(prev => ({ ...prev, date }))}
                className="rounded-md border"
              />
              
              <div>
                <Label htmlFor="seats">Number of Participants</Label>
                <Input
                  id="seats"
                  type="number"
                  min="1"
                  value={bookingData.seats}
                  onChange={(e) => setBookingData(prev => ({ 
                    ...prev, 
                    seats: parseInt(e.target.value),
                    total_cost: experience.experience.min_price * parseInt(e.target.value),
                    paid_cost: experience.experience.min_price * parseInt(e.target.value)
                  }))}
                />
              </div>

              <div>
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={bookingData.duration_hour}
                  onChange={(e) => setBookingData(prev => ({ ...prev, duration_hour: parseInt(e.target.value) }))}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Payment Details</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <Label className="text-lg">Total Cost</Label>
                <p className="text-3xl font-bold mt-2">AED {bookingData.total_cost}</p>
                <div className="mt-4 text-gray-600">
                  <p>• {bookingData.seats} participant{bookingData.seats > 1 ? 's' : ''}</p>
                  <p>• {bookingData.duration_hour} hour{bookingData.duration_hour > 1 ? 's' : ''}</p>
                  <p>• {format(bookingData.date, 'MMMM dd, yyyy')}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <BookingWizard />
  );
};

export default BookingPage;