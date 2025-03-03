"use client";
import React from 'react'

const Error = ({ error, reset }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
      <p className="text-gray-700 mb-6 text-center max-w-md">
        {error.message || 'An unexpected error occurred. Please try again later.'}
      </p>
      <button 
        onClick={() => reset()} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Try Again
      </button>
    </div>
  );
};

export default Error;