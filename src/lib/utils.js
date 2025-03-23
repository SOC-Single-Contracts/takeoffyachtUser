import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const constructImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-image.jpg';
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${baseUrl}${cleanPath}`;
};