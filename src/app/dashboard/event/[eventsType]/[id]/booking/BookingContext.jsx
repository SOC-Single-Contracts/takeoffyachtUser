"use client";
import { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children, initialEventData }) => {
  const [eventData, setEventData] = useState(initialEventData);
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
    selectedPackage: null,
  });

  const updateBookingData = (newData) => {
    setBookingData(prev => ({ ...prev, ...newData }));
  };

  const calculateTotal = () => {
    if (!bookingData.selectedPackage) return 0;
    
    const packagePrice = bookingData.selectedPackage.package_price || 0;
    const totalGuests = bookingData.adults + bookingData.kids;
    const featuresPrices = bookingData.selectedPackage.features?.reduce((total, feature) => 
      total + (feature.price || 0), 0) || 0;
    
    return (packagePrice + featuresPrices) * totalGuests;
  };

  return (
    <BookingContext.Provider value={{
      eventData,
      setEventData,
      bookingData,
      updateBookingData,
      calculateTotal,
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