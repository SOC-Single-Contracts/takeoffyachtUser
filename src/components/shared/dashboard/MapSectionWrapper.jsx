"use client";

import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapSectionWrapper = ({ latitude, longitude }) => {
  const mapStyles = {
    height: "250px",
    width: "100%",
    borderRadius: "0px",
  };

  const defaultCenter = {
    lat: 25.2048,
    lng: 55.2708
  };

  const center = latitude && longitude ? {
    lat: parseFloat(latitude),
    lng: parseFloat(longitude)
  } : defaultCenter;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium mb-4">Location</h2>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={center}
        >
          {latitude && longitude && (
            <Marker
              position={center}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapSectionWrapper;
