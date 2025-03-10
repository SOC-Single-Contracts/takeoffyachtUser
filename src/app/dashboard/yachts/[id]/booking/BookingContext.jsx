"use client";
import { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: new Date(),
    endDate: null,
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

  // const calculateTotal = () => {
  //   if (!selectedYacht?.yacht) return 0;
    
  //   const basePrice = selectedYacht.yacht.per_hour_price || 0;
  //   const newYearPrice = selectedYacht.yacht.new_year_price || basePrice;
  //   const hours = bookingData.duration || 3;
    
  //   const hourlyRate = bookingData.isNewYearBooking ? newYearPrice : basePrice;
    
  //   const extrasTotal = (bookingData.extras || []).reduce((total, item) => {
  //     return total + (item.price * item.quantity);
  //   }, 0);
    
  //   return (hourlyRate * hours) + extrasTotal;
  // };
  const calculateTotal = () => {
    if (!selectedYacht?.yacht) return 0;
    
    let basePrice = 0;
    
    if (bookingData.endDate) {
      // Calculate for date range booking
      const days = Math.ceil(
        (new Date(bookingData.endDate) - new Date(bookingData.date)) / (1000 * 60 * 60 * 24)
      ) + 1;
      basePrice = (selectedYacht.yacht.per_day_price || 0) * days;
    } else {
      // Calculate for hourly booking
      const hourlyRate = bookingData.isNewYearBooking 
        ? (selectedYacht.yacht.new_year_price || selectedYacht.yacht.per_hour_price || 0)
        : (selectedYacht.yacht.per_hour_price || 0);
      basePrice = hourlyRate * (bookingData.duration || 3);
    }
    
    const extrasTotal = (bookingData.extras || []).reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    return basePrice + extrasTotal;
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