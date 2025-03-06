"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dot, Heart } from "lucide-react";
import Image from "next/image";
import { fetchYachts } from "@/api/yachts";
import Link from "next/link";
import { Loading } from "@/components/ui/loading";
import { useSession } from "next-auth/react";
import Featured from "@/components/lp/Featured";
const FeaturedListings = () => {
  const [featuredYachts, setFeaturedYachts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data, status } = useSession();
  useEffect(() => {
    const getYachts = async () => {
      try {
        const yachtData = await fetchYachts(data?.user?.userid);
        setFeaturedYachts(yachtData);
      } catch (err) {
        setError(err.message || "Unexpected Error");
      } finally {
        setLoading(false);
      }
    };
    if(data?.user?.userid){
      getYachts();
    }
  }, []);
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p className="text-red-500">Error loading yachts: {error}</p>;
  }
  return (
    <section className="py-10 bg-gray-20">
      <div className="container px-4 mx-auto">
        <div className="w-full flex justify-between items-center mb-12">
        </div>
        <div className="my-[-6rem]">
        <Featured />
        </div>
      </div>
    </section>
  );
};
export default FeaturedListings;
