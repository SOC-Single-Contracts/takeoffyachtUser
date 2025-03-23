"use client";
import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
const AuthContext = createContext({});
export function AuthProvider({ children }) {
 const [user, setUser] = useState(null);
 const router = useRouter();
  const login = async (email, password) => {
   try {
     router.push('/dashboard');
   } catch (error) {
     throw new Error(error.message);
   }
 };
  const signup = async (name, email, password) => {
   try {
     router.push('/dashboard');
   } catch (error) {
     throw new Error(error.message);
   }
 };
  const loginWithGoogle = async () => {
   try {
   } catch (error) {
     throw new Error(error.message);
   }
 };
  const loginWithFacebook = async () => {
   try {
   } catch (error) {
     throw new Error(error.message);
   }
 };
  const loginWithApple = async () => {
   try {
   } catch (error) {
     throw new Error(error.message);
   }
 };
  return (
   <AuthContext.Provider value={{ 
     user, 
     login, 
     signup, 
     loginWithGoogle, 
     loginWithFacebook, 
     loginWithApple 
   }}>
     {children}
   </AuthContext.Provider>
 );
}
export const useAuth = () => useContext(AuthContext);