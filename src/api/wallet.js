import { API_BASE_URL } from "@/lib/api";
import axios from "axios";

export const getWallet = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/yacht/wallet/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

    if (response.data.error_code === "pass") {
      return response.data.data;
    }

    throw new Error(response.data.error || "Failed to fetch yachts.");
  } catch (error) {
    throw error;
  }
};