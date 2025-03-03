"use client"
import React, { useState, useEffect } from 'react';
import { fetchTestimonials } from '@/api/yachts';
import TestimonialsGrid from './TestimonialsGrid';
import { Loading } from '@/components/ui/loading';
import Image from 'next/image';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const getTestimonials = async () => {
        try {
          const data = await fetchTestimonials();
          setTestimonials(data);
        } catch (err) {
          setError(err.message || "Failed to load testimonials.");
        } finally {
          setLoading(false);
        }
      };
  
      getTestimonials();
    }, []);
  
    if (loading) {
      return <Loading />;
    }
  
    if (error) {
      return <p className="text-red-500">Error: {error}</p>;
    }
  return (
    <>
      <div className="flex flex-col justify-center text-center container mx-auto w-full items-center gap-2 my-5">
      <div className="flex items-center justify-center">
          <Image src="/assets/images/maskleft.svg" width={50} height={50} alt="" />
          <h1 className="text-4xl font-bold flex items-center gap-2">4.94</h1>
          <Image src="/assets/images/maskright.svg" width={50} height={50} alt="" />
        </div>
      <h6 className="text-lg font-semibold">Tourist’s Favourite</h6>
        <p className="text-gray-700 dark:text-gray-400 font-light text-sm text-balance">
          Sapien facilisis ut malesuada sed tellus adipiscing. Volutpat dictum
          libero tincidunt bibendum sed tempor lectus egestas.
        </p>
      </div>
      <TestimonialsGrid testimonials={testimonials} />
    </>
  );
};

export default Testimonials;