// "use client";

// import React, { useEffect, useRef } from "react";
// import mapboxgl from "mapbox-gl";

// mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN"; // Replace with your token

// const Map = ({ markers = [] }) => {
//     const mapContainerRef = useRef(null);
//     const mapRef = useRef(null);

//     useEffect(() => {
//         if (!mapContainerRef.current) return;

//         // Initialize Map
//         const map = new mapboxgl.Map({
//             container: mapContainerRef.current,
//             style: "mapbox://styles/mapbox/streets-v11",
//             center: [-74.006, 40.7128], // Default: NYC
//             zoom: 10,
//         });

//         // Add Navigation Controls
//         map.addControl(new mapboxgl.NavigationControl(), "top-right");

//         // Add Markers Dynamically
//         markers.forEach(({ lng, lat }) => {
//             new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
//         });

//         mapRef.current = map;

//         return () => map.remove();
//     }, [markers]); // Re-run when markers change

//     return (
//         <div className="relative w-full h-[500px]">
//             <div ref={mapContainerRef} className="absolute inset-0" />
//         </div>
//     );
// };

// export default Map;
