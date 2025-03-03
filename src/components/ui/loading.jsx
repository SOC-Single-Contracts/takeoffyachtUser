"use client"

export function Loading() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-[#BEA355] border-opacity-20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#BEA355] border-t-transparent rounded-full animate-spin-custom"></div>
        <div className="absolute inset-2 border-2 border-[#BEA355] border-l-transparent rounded-full animate-spin-reverse"></div>
      </div>
    </div>
  );
}
