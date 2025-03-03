import axios from 'axios';
const API_BASE_URL = 'https://api.takeoffyachts.com';

export const fetchAllEvents = async (userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/yacht/check_event/`, {
            user_id: userId
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching all events:', error);
        throw error;
    }
};

export const findEventById = async (eventId) => {
    const id = parseInt(eventId, 10);
    
    if (isNaN(id) || id <= 0) {
        throw new Error('Invalid event ID');
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/yacht/get_event/${id}`);
        if (!response.data.data || response.data.data.length === 0) {
            throw new Error('Event not found');
        }
        return response.data.data[0];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new Error('Event not found');
        }
        console.error(`Error finding event with ID ${id}:`, error);
        throw error;
    }
};

export const createEventBooking = async (bookingData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/yacht/event_booking/`, bookingData);
        return response.data;
    } catch (error) {
        console.error('Error creating event booking:', error);
        throw error;
    }
};

export const getEventBooking = async (bookingId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/yacht/get_event_booking/${bookingId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching booking details:', error);
        throw error;
    }
};

export const makeRemainingPayment = async (bookingId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/event_remaining_payment/`, {
            booking_id: bookingId
        });
        return response.data;
    } catch (error) {
        console.error('Error processing remaining payment:', error);
        throw error;
    }
};