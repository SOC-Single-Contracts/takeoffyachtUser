import { API_BASE_URL } from "@/lib/api";
import axios from "axios";

export const fetchYachts = async (id) => {
  try {
    const response = await axios.get(`https://api.takeoffyachts.com/yacht/get_yacht/1`);

    if (response.data.error_code === "pass") {
      return response.data.data;
    }

    throw new Error(response.data.error || "Failed to fetch yachts.");
  } catch (error) {
    throw error;
  }
};

export const fetchExperience = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/yacht/get_experience/${id} `);

    if (response.data.error_code === "pass") {
      return response.data.data;
    }

    throw new Error(response.data.error || "Failed to fetch yachts.");
  } catch (error) {
    throw error;
  }
};

export const fetchEvents = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/yacht/get_event/1`);

    if (response.data.error_code === "pass") {
      return response.data.data;
    }

    throw new Error(response.data.error || "Failed to fetch yachts.");
  } catch (error) {
    throw error;
  }
};

export const fetchTestimonials = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/yacht/yacht_testimonal/`);

    if (response.data.error_code === "pass") {
      return response.data.testimonal;
    }

    throw new Error(response.data.error || "Failed to fetch testimonials.");
  } catch (error) {
    throw error;
  }
};

export const fetchAllYachts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/yacht/yacht/`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all yachts:", error);
    throw error;
  }
};

export const findYachtById = async (yachtId) => {
  try {
    const yachts = await fetchAllYachts();
    const yachtItem = yachts.find((yacht) => yacht.yacht.id === yachtId);
    if (!yachtItem) {
      throw new Error(`Yacht with ID ${yachtId} not found`);
    }
    return yachtItem;
  } catch (error) {
    console.error(`Error finding yacht with ID ${yachtId}:`, error);
    throw error;
  }
};

export const fetchYachtCategories = async (yachtId) => {
  try {
    const yacht = await findYachtById(yachtId);
    return yacht.categories;
  } catch (error) {
    console.error(
      `Error fetching categories for yacht with ID ${yachtId}:`,
      error
    );
    throw error;
  }
};

export const fetchYachtSubcategories = async (yachtId) => {
  try {
    const yacht = await findYachtById(yachtId);
    return yacht.subcategories;
  } catch (error) {
    console.error(
      `Error fetching subcategories for yacht with ID ${yachtId}:`,
      error
    );
    throw error;
  }
};

export const fetchYachtFood = async (yachtId) => {
  try {
    const yacht = await findYachtById(yachtId);
    return yacht.food;
  } catch (error) {
    console.error(
      `Error fetching food items for yacht with ID ${yachtId}:`,
      error
    );
    throw error;
  }
};

export const fetchYachtBookingTime = async (yachtId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/yacht/yacht_get_booking_time/`,
      {
        params: { yacht_id: yachtId },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching booking time for yacht with ID ${yachtId}:`,
      error
    );
    throw error;
  }
};

export const cancelYachtBooking = async (bookingData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/yacht/yacht_cancel_booking/`,
      bookingData
    );
    return response.data;
  } catch (error) {
    console.error("Error cancelling yacht booking:", error);
    throw error;
  }
};

export const checkYachts = async (userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/yacht/check_yacht/`, {
            user_id: userId
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching yachts:', error);
        throw error;
    }
};

export const getYachtBookingTimes = async (yachtId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/yacht/yacht_get_booking_time/`, {
            params: { yacht_id: yachtId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching booking times:', error);
        throw error;
    }
};

export const createYachtBooking = async (bookingData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/yacht/yacht_booking/`, bookingData);
        return response.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

export const getYachtBooking = async (userId, yachtId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/yacht/get_yacht_booking/${userId}`, {
            params: { yacht_id: yachtId }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching booking details:', error);
        throw error;
    }
};

export const makePartialPayment = async (paymentData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/yacht/yacht_partial_payment/`, paymentData);
        return response.data;
    } catch (error) {
        console.error('Error processing payment:', error);
        throw error;
    }
};

export const getYachtFood = async (yachtId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/yacht/yacht_food/`, {
            params: { yacht_id: yachtId }
        });
        return response.data.food;
    } catch (error) {
        console.error('Error fetching food menu:', error);
        throw error;
    }
};

export const getYachtDetails = async (yachtId, userId) => {
  try {
    const response = await fetch(`https://api.takeoffyachts.com/api/yacht/${yachtId}?userid=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch yacht details');
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error fetching yacht details');
  }
};

export const createYachtBookingWithStripe = async (bookingData) => {
  try {
      const response = await axios.post(`${API_BASE_URL}/yacht/yacht_booking/`, bookingData);
      if (response.data.url) {
          return response.data;
      }
      throw new Error('Stripe payment URL not received');
  } catch (error) {
      console.error('Error creating booking with Stripe:', error);
      throw error;
  }
};