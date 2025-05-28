import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';

import { switchReducer } from './switchReducer';

// Create a context
export const GlobalStateContext = createContext();

const initialState = {
  number: 3,
  cities: [],
}
const persistState = () => {
  try {
    if (typeof window !== "undefined") {
      const storedState = localStorage.getItem('globalStateYachtProject');
      return storedState ? JSON.parse(storedState) : initialState; // Default state if nothing is stored
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return initialState; // Fallback state
  }
};

// Create a provider component
export const GlobalStateProvider = ({ children }) => {
  const [state, setState] = useState(
    {
      filters: {
        min_guest: 0,
        max_guest: 0,
        location: "",
        start_date:"",
        end_date:""
      }
    }
  ); // Example of global state


  const [globalState, dispatch] = useReducer(switchReducer, persistState())

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem('globalStateYachtProject', JSON.stringify(globalState));
    }
  }, [globalState]);

  // Function to update user info
  const setFilter = (newFilters) => {
    setState((prevState) => ({
      ...prevState, // Spread the previous state to keep other values intact
      filters: {
        ...prevState.filters, // Spread the previous user info to preserve other user properties
        ...newFilters, // Update user with the new info
      },
    }));
  };

  return (
    <GlobalStateContext.Provider value={{ state, setState, setFilter, globalState, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Create a custom hook to use the context easily
export const useGlobalState = () => {
  return useContext(GlobalStateContext);
};
