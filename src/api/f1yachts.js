import { API_BASE_URL } from "@/lib/api";
import axios from "axios";

export const fetchf1Yachts = async (id) => {
  try {
    const response = await axios.get(`https://api.takeoffyachts.com/yacht/f1-yachts/`);

    
    if (response.data.error_code === "pass") {
      return response.data.data;
    }

    throw new Error(response.data.error || "Failed to fetch yachts.");
  } catch (error) {
    throw error;
  }
};
