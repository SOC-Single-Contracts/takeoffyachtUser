'use client';

import { Button } from '@/components/ui/button';
import { Anchor, Home, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}) {

  return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
          <div className="max-w-3xl w-full text-center space-y-8">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 animate-pulse">
                <Anchor className="w-full h-full text-[#BEA355]" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                Rough Waters Ahead
              </h1>
              <p className="text-xl text-gray-600">
                We've encountered some unexpected waves. Our crew is working to get things back on course.
              </p>
              <p className="text-sm text-gray-500">
                Error: {error.message || 'Something went wrong'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={reset}
                className="bg-[#BEA355] hover:bg-[#9A844A] text-white px-6 py-2 rounded-full flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                className="bg-white border-2 border-[#BEA355] text-[#BEA355] hover:bg-[#BEA355] hover:text-white px-6 py-2 rounded-full flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Shore
              </Button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
              <svg
                className="w-full h-full"
                viewBox="0 0 1440 320"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#BEA355"
                  fillOpacity="1"
                  d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
  );
}