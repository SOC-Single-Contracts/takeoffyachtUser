import { API_BASE_URL } from '@/lib/api';
import axios from 'axios';

export const fetchAllFood = async () => {
   try {
       const response = await axios.get(`${API_BASE_URL}/food/`);
       return response.data.food;
   } catch (error) {
       console.error('Error fetching all food items:', error);
       throw error;
   }
};

export const fetchAllYachtFood = async () => {
   try {
       const response = await axios.get(`${API_BASE_URL}/yacht_food/`);
       return response.data.food;
   } catch (error) {
       console.error('Error fetching all yacht food items:', error);
       throw error;
   }
}

export const findFoodById = async (foodId) => {
   try {
       const foodItems = await fetchAllFood();
       const foodItem = foodItems.find(food => food.id === foodId);
       if (!foodItem) {
           throw new Error(`Food item with ID ${foodId} not found`);
       }
       return foodItem;
   } catch (error) {
       console.error(`Error finding food item with ID ${foodId}:`, error);
       throw error;
   }
}

export const findYachtFoodById = async (foodId) => {
   try {
       const yachtFoodItems = await fetchAllYachtFood();
       const yachtFoodItem = yachtFoodItems.find(food => food.id === foodId);
       if (!yachtFoodItem) {
           throw new Error(`Yacht food item with ID ${foodId} not found`);
       }
       return yachtFoodItem;
   } catch (error) {
       console.error(`Error finding yacht food item with ID ${foodId}:`, error);
       throw error;
   }
}