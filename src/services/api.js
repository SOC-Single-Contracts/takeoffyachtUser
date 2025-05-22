const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const yachtApi = {
  // Yacht listings
  getAllYachts: async (userid) => {
    const response = await fetch(`${API_BASE_URL}/yacht/yacht/${userid}`);
    return response.json();
  },

  // Categories
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/yacht/category_data/`);
    return response.json();
  },

  // Subcategories
  getSubcategories: async () => {
    const response = await fetch(`${API_BASE_URL}/yacht/subcategory_data/`);
    return response.json();
  },

  // Food menu
  getFoodMenu: async () => {
    const response = await fetch(`${API_BASE_URL}/yacht/food/`);
    return response.json();
  },

  // Testimonials
  getTestimonials: async () => {
    const response = await fetch(`${API_BASE_URL}/yacht/yacht_testimonal/`);
    return response.json();
  },

  // Booking
  createBooking: async (bookingData) => {

    // Ensure yacht_id is present and is a number
    if (!bookingData.yacht_id || isNaN(parseInt(bookingData.yacht_id))) {
      throw new Error('Invalid yacht ID');
    }

    // Convert yacht_id to number if it's a string
    const formattedData = {
      ...bookingData,
      yacht_id: parseInt(bookingData.yacht_id)
    };

    const response = await fetch(`${API_BASE_URL}/yacht/yacht_booking/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    const data = await response.json();

    return data;
  },

  // Get booking time slots
  getBookingTimeSlots: async (yachtId) => {
    const response = await fetch(`${API_BASE_URL}/yacht/yacht_get_booking_time/?yacht_id=${yachtId}`);
    return response.json();
  },

  // Partial payment
  makePartialPayment: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/yacht/yacht_partial_payment/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    return response.json();
  },

  checkAvailability: async (yachtId) => {
    const response = await fetch(`${API_BASE_URL}/yacht/yacht_get_booking_time/?yacht_id=${yachtId}`);
    return response.json();
  },

  // Create initial booking
  createBooking: async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/yacht/yacht/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    return response.json();
  },

  createExperienceBooking: async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/yacht/experience_booking/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    return response.json();
  },

  createEventBooking: async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/yacht/check_event/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    return response.json();
  },

  // Process partial payment
  processPartialPayment: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/yacht/yacht_partial_payment/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return response.json();
  },

  // Get yacht booking details
  getYachtBooking: async (yachtId, userId) => {
    const response = await fetch(`${API_BASE_URL}/yacht/get_yacht_booking/${yachtId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ yacht_id: yachtId, user_id: userId })
    });
    return response.json();
  },

  processFullPayment: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/yacht/yacht_booking/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return response.json();
  },

  // Process partial payment
  processPartialPayment: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/yacht/yacht_booking/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return response.json();
  },
  processEventFullPayment: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/yacht/event_booking/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return response.json();
  },
  processExperienceFullPayment: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/yacht/experience_booking/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return response.json();
  },

  // Process partial payment
  processEventPartialPayment: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/yacht/event_partial_payment/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return response.json();
  },

  // Search endpoints
  checkYachts: async (params) => {
    try {
      const response = await fetch(`${API_BASE_URL}/yacht/check_yacht/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      return response.json();
    } catch (error) {
      console.error('Error checking yachts:', error);
      throw error;
    }
  },

  checkExperiences: async (params) => {
    try {
      const response = await fetch(`${API_BASE_URL}/yacht/check_experience/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      return response.json();
    } catch (error) {
      console.error('Error checking experiences:', error);
      throw error;
    }
  },

  checkEvents: async (params) => {
    try {
      const response = await fetch(`${API_BASE_URL}/yacht/check_eventsystem/?page=1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      return response.json();
    } catch (error) {
      console.error('Error checking events:', error);
      throw error;
    }
  },
};

export default yachtApi;

export const eventApi = {
  // Get event details
  getEvent: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/yacht/get_event/${eventId}`);
    return response.json();
  },

  // Check event availability
  checkEvent: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/yacht/check_event/?user_id=${userId}`);
    return response.json();
  },

  // Process full payment for event
  processEventBooking: async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/yacht/event_booking/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    return response.json();
  },

  // Process partial payment for event
  processEventPartialPayment: async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/yacht/event_partial_payment/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    return response.json();
  }
};