"use client";
import { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    date: new Date(),
    startTime: new Date(),
    seats: 1,
    duration_hour: 1,
    total_cost: 0,
    paid_cost: 0,
    fullName: '',
    email: '',
    country: '',
    phone: '',
    message: '',
    extras: [],
    payment_method: 'card',
    payment_intent_id: '',
  });

  const calculateTotal = () => {
    if (!selectedExperience?.experience) return 0;
    
    const basePrice = selectedExperience.experience.min_price || 0;
    const totalPrice = basePrice * bookingDetails.seats;
    
    // Add extras cost if any
    const extrasTotal = bookingDetails.extras.reduce((total, extra) => {
      return total + (extra.price * extra.quantity);
    }, 0);

    return totalPrice + extrasTotal;
  };

  const updateBookingDetails = (newDetails) => {
    setBookingDetails(prev => {
      const updated = { ...prev, ...newDetails };
      // Recalculate total cost whenever relevant fields change
      if (newDetails.seats !== undefined || newDetails.extras !== undefined) {
        updated.total_cost = calculateTotal();
        updated.paid_cost = calculateTotal();
      }
      return updated;
    });
  };

  return (
    <BookingContext.Provider 
      value={{ 
        selectedExperience, 
        setSelectedExperience,
        bookingDetails,
        updateBookingDetails,
        calculateTotal
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;
