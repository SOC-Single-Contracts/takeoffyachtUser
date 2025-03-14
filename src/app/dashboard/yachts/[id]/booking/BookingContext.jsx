"use client";
import { createContext, useContext, useEffect, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: new Date(),
    endDate: null,
    startTime: new Date(),
    duration: 3,
    bookingType: 'hourly',
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
    paymentType: 'initial',
    paidAmount: 0,
    remainingAmount: 0,
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    paymentError: null,
    paymentProcessing: false
  });

  const resetPaymentState = () => {
    setBookingData(prev => ({
      ...prev,
      paymentType: 'initial',
      paidAmount: 0,
      remainingAmount: 0
    }));
  };


  const updateBookingData = (newData) => {
    setBookingData(prev => ({ ...prev, ...newData }));
  };



  const calculateTotal = () => {
    if (!selectedYacht?.yacht) return 0;
    
    let baseTotal = 0;
    
    if (bookingData.bookingType === 'hourly') {
      const basePrice = selectedYacht.yacht.per_hour_price || 0;
      const newYearPrice = selectedYacht.yacht.new_year_price || basePrice;
      const hours = bookingData.duration || 3;
      const hourlyRate = bookingData.isNewYearBooking ? newYearPrice : basePrice;
      baseTotal = hourlyRate * hours;
    } else {
      // Date range booking
      const startDate = new Date(bookingData.date);
      const endDate = new Date(bookingData.endDate || bookingData.date);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      baseTotal = (selectedYacht.yacht.per_day_price || 0) * days;
    }
    
    const extrasTotal = (bookingData.extras || []).reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    return baseTotal + extrasTotal;
  };

  const updatePaymentInfo = (data) => {
    setBookingData(prev => ({
      ...prev,
      paymentType: data.remaining_cost > 0 ? 'remaining' : 'initial',
      hasExistingPayment: data.paid_cost > 0,
      remainingCost: data.remaining_cost || 0,
      paidCost: data.paid_cost || 0
    }));
  };


  return (
    <BookingContext.Provider value={{
      resetPaymentState,
      bookingData,
      updateBookingData,
      selectedYacht,
      setSelectedYacht,
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