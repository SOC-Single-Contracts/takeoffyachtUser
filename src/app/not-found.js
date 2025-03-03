"use client";

import Link from "next/link";
import React from "react";
import { Home, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

const NotFoundActions = () => {
  const router = useRouter();

  const handleReload = () => {
    router.refresh();
  };

  return (
    <div className="flex justify-center space-x-4">
      <Link
        href="/"
        className="flex items-center space-x-2 bg-[#BEA355] hover:bg-[#BEA355]/90 text-white px-6 py-3 rounded-full transition duration-300 shadow-lg transform hover:scale-105 active:scale-95 group"
      >
        <Home className="w-5 h-5 group-hover:animate-spin" />
        <span>Return Home</span>
      </Link>

      <button
        onClick={handleReload}
        className="flex items-center space-x-2 border border-[#BEA355] text-[#BEA355] hover:bg-[#BEA355]/10 px-6 py-3 rounded-full transition duration-300 transform hover:scale-105 active:scale-95 group"
      >
        <RefreshCw className="w-5 h-5 group-hover:animate-spin" />
        <span>Reload Page</span>
      </button>
    </div>
  );
};

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-[#E0E0E0] to-[#BEA355] flex items-center justify-center p-6 overflow-hidden">
      <div className="relative w-full max-w-4xl">
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-12 text-center relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none animate-[spin_20s_linear_infinite]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#BEA355]/20 to-[#F5F5F5]/20 transform -skew-x-12"></div>
          </div>

          {/* 404 Content */}
          <div className="relative">
            <div className="text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#BEA355] to-gray-600 leading-none animate-bounce">
              404
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl font-bold text-[#BEA355]/10 -z-10 animate-pulse">
              LOST
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mt-4">
            Page Not Found
          </h1>

          <p className="text-lg text-gray-600 mt-4 mb-8">
            Oops! The page you're looking for seems to have set sail on an unexpected voyage.
          </p>

          <NotFoundActions />
        </div>

        {/* Decorative Blurred Circles */}
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#BEA355]/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gray-300/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
};

export default NotFound;
