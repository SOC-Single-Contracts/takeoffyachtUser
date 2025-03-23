import { API_BASE_URL } from '@/lib/api';
import axios from 'axios';
export const fetchAllPackages = async () => {
   try {
       const response = await axios.get(`${API_BASE_URL}/package/`);
       return response.data.package;
   } catch (error) {
       console.error('Error fetching all packages:', error);
       throw error;
   }
}
export const fetchAllPackageFeatures = async () => {
   try {
       const response = await axios.get(`${API_BASE_URL}/package_feature/`);
       return response.data.feature;
   } catch (error) {
       console.error('Error fetching all package features:', error);
       throw error;
   }
}
export const findPackageById = async (packageId) => {
   try {
       const packages = await fetchAllPackages();
       const packageItem = packages.find(pkg => pkg.id === packageId);
       if (!packageItem) {
           throw new Error(`Package with ID ${packageId} not found`);
       }
       return packageItem;
   } catch (error) {
       console.error(`Error finding package with ID ${packageId}:`, error);
       throw error;
   }
}
export const findPackageFeatureById = async (featureId) => {
   try {
       const features = await fetchAllPackageFeatures();
       const feature = features.find(feat => feat.id === featureId);
       if (!feature) {
           throw new Error(`Feature with ID ${featureId} not found`);
       }
       return feature;
   } catch (error) {
       console.error(`Error finding feature with ID ${featureId}:`, error);
       throw error;
   }
}