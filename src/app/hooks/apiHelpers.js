export const handleApiResponse = async (response) => {
    const data = await response.json();
    
    if (data.error_code === 'failed') {
      throw new Error(data.error || 'Operation failed');
    }
    
    return data;
  };
  
  export const formatBookingData = (bookingData, yacht, userId) => {
    return {
      guest: bookingData.adults + bookingData.kids,
      yacht: yacht.id,
      user_id: userId,
      duration_hour: bookingData.duration,
      booking_date: bookingData.date,
      booking_time: bookingData.startTime,
      phone_number: bookingData.phone,
      country: bookingData.country,
      message: bookingData.notes,
      adults: bookingData.adults,
      kid_teen: bookingData.kids,
      partial_payment: bookingData.isPartialPayment,
    };
  };