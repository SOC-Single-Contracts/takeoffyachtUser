"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { listyachts } from "../../../../public/assets/images";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Heart } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { featuredYachts, tabData, topDestinations } from "@/app/data";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import Link from "next/link";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "8px",
};

const center = {
  lat: 25.276987,
  lng: 55.296249,
};

const MapSection = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  return (
  <div className="w-full h-full">
     <h1>Location</h1>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
          }}
        >
        </GoogleMap>
      </LoadScript>
    </div>
);
}

const TopCard = () => (
  <div className="bg-white p-4 mb-6 shadow-xl rounded-xl flex justify-between h-[110px]">
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-medium">List your yachts & experiences</h3>
      <p className="text-sm text-gray-500">
        Topsail ensign landlubber poop locker. Crimp blossom dock.
      </p>
    </div>
    <Image
      src={listyachts}
      alt="List your yachts & experiences"
      width={100}
      height={100}
      className="mr-[-1rem]"
    />
  </div>
);

const CarouselSection = ({ title, data, isDestination = false }) => (
  <div className="gap-4">
    <div className="flex justify-between items-center my-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="flex items-center gap-2">
        <Button className="bg-transparent text-black shadow-none hover:bg-transparent font-medium">
          See All
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full bg-white shadow-xl hover:bg-white h-10 w-10"
        >
          <ArrowRight className="h-7 w-7" />
        </Button>
      </div>
    </div>

    <Carousel className="w-full">
      <CarouselContent>
        {data.map((item) => (
          <CarouselItem
            key={item.id || item.label}
            className={isDestination ? "md:basis-1/1 lg:basis-1/3" : "md:basis-1/1 lg:basis-1/2"}
          >
            <Link href={`/dashboard/yachts/${item.id}`} passHref>
            {isDestination ? (
              <Card className="w-full shadow-none border-none cursor-pointer hover:shadow-lg">
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={400}
                  height={400}
                  className="rounded-[1.5rem]"
                />
                <CardContent className="p-2">
                  <h3 className="text-md font-semibold mb-2">{item.label}</h3>
                </CardContent>
              </Card>
            ) : (
              <Card className="overflow-hidden rounded-2xl shadow-md my-2 bg-white w-full max-w-[450px] h-[115px] flex cursor-pointer hover:shadow-lg">
                <div className="relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={220}
                    height={220}
                    className="object-cover p-2"
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-4 right-4 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white h-7 w-7"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>

                <CardContent className="p-2">
                  <h3 className="text-md font-semibold mb-2">{item.name}</h3>
                  <div className="flex flex-wrap items-center w-full">
                    <div className="text-center flex items-center space-x-2 text-black font-semibold text-xs mr-2">
                      <p>{item.guests}</p>
                      <p>Guests</p>
                    </div>
                    <p className="text-black font-semibold text-xs mr-2">{item.size}</p>
                    <div className="text-center flex items-center text-black font-semibold text-xs space-x-2">
                      <p>Sleeps</p>
                      <p>{item.sleeps}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mt-2">
                        {item.hourlyRate}
                        <span className="text-xs">/per hour</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
);

const DashboardTabs = () => {
  return (
    <Tabs defaultValue="wedding" className="py-2 overflow-x-auto container mx-auto">
      <TabsList className="w-full bg-transparent space-x-3">
        {tabData.map((tab) => (
          <TabsTrigger
            key={tab.value}
            className={`text-white font-light bg-[#ffff]/5 backdrop-blur-md border-2 border-transparent 
                        shadow-inner rounded-full px-6 py-3 
                        data-[state=active]:border-white/20 data-[state=active]:text-white data-[state=active]:bg-[#ffff]/10`}
            value={tab.value}
          >
            <Image src={tab.icon} alt={`${tab.label} Icon`} width={32} height={32} className="mr-2" />
            <span>{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabData.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="px-2">
          <div className="grid md:grid-cols-2 gap-4 mt-16">
            {/* Left Section: Map */}
            <MapSection label={tab.label} />
            <div className="w-full max-w-[700px]">
              <TopCard />
              <CarouselSection title="Featured Listings" data={featuredYachts} />
              <CarouselSection title="Total Experiences" data={featuredYachts} />
              <CarouselSection title="Formula One" data={featuredYachts} />
              <CarouselSection title="Top Destinations" data={topDestinations} isDestination />
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default DashboardTabs;