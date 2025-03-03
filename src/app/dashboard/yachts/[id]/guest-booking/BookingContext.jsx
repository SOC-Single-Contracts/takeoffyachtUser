"use client";
import { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: new Date(),
    startTime: new Date(),
    duration: 3,
    adults: 0,
    kids: 0,
    fullName: '',
    email: '',
    phone: '',
    country: '',
    notes: '',
    isPartialPayment: false,
    termsAccepted: false,
    bookingId: null,
    food: 0,
    waterSports: 0,
    misc: 0,
    extras: [],
    // Payment related fields
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    paymentError: null,
    paymentProcessing: false
  });

  const updateBookingData = (newData) => {
    setBookingData(prev => ({ ...prev, ...newData }));
  };

  const calculateTotal = () => {
    if (!selectedYacht?.yacht) return 0;
    
    const basePrice = selectedYacht.yacht.per_hour_price || 0;
    const newYearPrice = selectedYacht.yacht.new_year_price || basePrice;
    const hours = bookingData.duration || 3;
    
    const hourlyRate = bookingData.isNewYearBooking ? newYearPrice : basePrice;
    
    const extrasTotal = (bookingData.extras || []).reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    return (hourlyRate * hours) + extrasTotal;
  };

  return (
    <BookingContext.Provider value={{
      bookingData,
      updateBookingData,
      selectedYacht,
      setSelectedYacht,
      calculateTotal
    }}>
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