"use client"
import { cn } from "@/lib/utils";

export function GlobalLoading({ className }) {
  return (
    <div className={cn(
      "fixed inset-0 bg-white dark:bg-gray-900 z-[9999] flex items-center justify-center transition-opacity duration-300",
      className
    )}>
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 border-4 border-[#BEA355] border-opacity-20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#BEA355] border-t-transparent rounded-full animate-spin-custom"></div>
        <div className="absolute inset-2 border-2 border-[#BEA355] border-l-transparent rounded-full animate-spin-reverse"></div>
      </div>
    </div>
  );
}