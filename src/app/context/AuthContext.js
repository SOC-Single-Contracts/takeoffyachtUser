"use client";

import { createContext, useContext } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();

  const login = async (email, password) => {
    try {
      const result = await signIn("credentials", {
        Email: email,
        Password: password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => signOut();

  return (
    <AuthContext.Provider value={{ 
      user: session?.user,
      status,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);