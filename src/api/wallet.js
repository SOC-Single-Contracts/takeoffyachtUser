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

export const freezeWallet = async (token,payload) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/yacht/wallet/`,
      { action: payload ? "unfreeze" :"freeze" }, 
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (response.data.error_code === "pass") {
      return response.data.message;
    }

  } catch (error) {
    console.error('Error Freeze:', error);
    throw error;
  }
};

export const payWithWallet = async (token,payload) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/yacht/wallet/`,
      {payload}, 
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log(response)
    if (response.data.error_code === "pass") {
      return response.data.data;
    }

  } catch (error) {
    console.error('Error Freeze:', error);
    throw error;
  }
};

