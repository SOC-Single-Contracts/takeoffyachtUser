import axios from "axios";
const API_BASE_URL = "https://api.takeoffyachts.com";

export const fetchAllExperiences = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/yacht/get_experience/1`);
    if (response.data.error_code === "pass") {
      return response.data.data;
    }
    throw new Error(response.data.error || "Failed to fetch experiences.");
  } catch (error) {
    console.error("Error fetching all experiences:", error);
    throw error;
  }
};

export const fetchExperienceBookings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/yacht/experience_booking/`);
    if (response.data.error_code === "pass") {
      return response.data.booking;
    }
    throw new Error(
      response.data.error || "Failed to fetch experience bookings."
    );
  } catch (error) {
    console.error("Error fetching experience bookings:", error);
    throw error;
  }
};

export const fetchExperienceList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/yacht/get_experience/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching experience list:", error);
    throw error;
  }
};

export const findExperienceById = async (experienceId) => {
    try {
        const experiences = await fetchExperienceList();
        const experience = experiences.find(exp => exp.id === experienceId);
        if (!experience) {
            throw new Error(`Experience with ID ${experienceId} not found`);
        }
        return experience;
    } catch (error) {
        console.error(`Error finding experience with ID ${experienceId}:`, error);
        throw error;
    }
}