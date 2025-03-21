import React, { createContext, useContext, useState } from 'react';

// Create a context
const GlobalStateContext = createContext();

// Create a provider component
export const GlobalStateProvider = ({ children }) => {
  const [state, setState] = useState(
    {
        filters: {
            min_guest: 0,
            max_guest: 0,
            location: ""
        }
    }
  ); // Example of global state

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
    <GlobalStateContext.Provider value={{ state, setState, setFilter }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Create a custom hook to use the context easily
export const useGlobalState = () => {
  return useContext(GlobalStateContext);
};
