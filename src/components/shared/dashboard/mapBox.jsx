"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
mapboxgl.accessToken = "pk.eyJ1IjoidGFrZW9mZnlhY2h0cyIsImEiOiJjbThzZjVzMnIxNTdwMmxzYWZjY2V2MmdsIn0.b-adD8juJslnBX5RGUx4Hw";

const MapBoxComponent = ({ markers = [], movingObjects = [], callingFrom }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    // console.log("markers",markers)
    // console.log("movingObjects",movingObjects)
    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [55.269734, 25.200249],
            zoom: 10,
        });

        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        map.on("load", () => {
            // console.log("Map loaded!");

            // ✅ Ensure Image is Loaded First
            if (!map.hasImage("custom-marker")) {
                map.loadImage("https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png", (error, image) => {
                    if (error) {
                        console.error("Error loading image:", error);
                        return;
                    }
                    if (!map.hasImage("custom-marker")) {
                        map.addImage("custom-marker", image);
                    }
                    addMovingObjects(map); // ✅ Call after ensuring image exists
                });
            } else {
                addMovingObjects(map);
            }

            markers?.forEach(({ latitude, longitude, yacht, yachtsType }) => {
                const el = document.createElement("div");
                el.className = "marker";
                el.style.backgroundImage = "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOgJ5SI2oD-qfojLOmcIslE0eBkg-kT5dMlw&s)";
                el.style.width = "30px";
                el.style.height = "30px";
                el.style.backgroundSize = "cover";
                el.style.borderRadius = "50%";
                el.style.cursor = "pointer";


                // el.className = "marker";
                // el.style.backgroundImage = "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvKwVW_FId6zWXEw7gKjxQhzpl50GP4ed5Iw&s)";
                // el.style.width = "30px";
                // el.style.height = "30px";
                // el.style.backgroundSize = "cover";
                // el.style.borderRadius = "50%";
                // el.style.cursor = "pointer";

                const yachtName = yacht?.name || "Yacht Name";
                const yachtImage = yacht?.yacht_image ? `${process.env.NEXT_PUBLIC_S3_URL}${yacht.yacht_image}` : "/assets/images/fycht.jpg";
                const pricePerHour = yacht?.per_hour_price || "0";
                const pricePerDay = yacht?.per_day_price || "0";
                const yachtLength = yacht?.length || "0";
                const yachtGuests = yacht?.guest || "0";
                const yachtCabins = yacht?.number_of_cabin || "0";
                const yachtId = yacht?.id || "1";


                const popupHtml = `
  <div class="overflow-hidden cursor-pointer bg-white dark:bg-gray-800 w-full max-w-[350px] rounded-2xl shadow-lg hover:shadow-2xl transition duration-500 ease-in-out">
    <a class="flex pb-2 items-center" href="${callingFrom == "experience"
                        ? `/dashboard/experience/${yachtsType}/${yachtId}`
                        : `/dashboard/${yachtsType}/${yachtId}`
                    }">
      <div class="relative">
        <img src="${yachtImage}" alt="${yachtName}" class="object-cover px-3 pt-3 rounded-3xl max-w-[130px] w-[130px] h-[129px]" 
          onerror="this.src='/assets/images/fycht.jpg'">
        
      </div>

      <div class="px-4 py-2">
        <div class="flex justify-between items-center">
          <h3 class="text-[20px] font-semibold mb-1 truncat max-w-[230px]">${yachtName}</h3>
        </div>

        <div class="flex mt-4 justify-start items-center gap-1 flex-wrap">
          <img src="/assets/images/transfer.svg" alt="length" width="9" height="9">
          <p class="font-semibold text-xs">${yachtLength} ft</p>
          <span class="text-xs">•</span>
          <div class="text-center font-semibold flex items-center text-xs space-x-2">
            <img src="/assets/images/person.svg" alt="guests" width="8" height="8">
            <p>Guests</p>
            <p>${yachtGuests}</p>
          </div>
          <span class="text-xs">•</span>
          <div class="text-center font-semibold flex items-center text-xs space-x-2">
            <img src="/assets/images/cabin.svg" alt="cabins" width="8" height="8">
            <p>Cabins</p>
            <p>${yachtCabins}</p>

               <span class="font-medium text-xs">
            AED <span class="font-bold text-sm text-primary">${yachtsType == "f1yachts" || yachtsType == "f1-exp" ? pricePerDay : pricePerHour}</span>
            <span class="text-xs font-light ml-1">/${yachtsType == "f1yachts" || yachtsType == "f1-exp" ? "Day" : "hour"}</span>
          </span>
          </div>
        </div>
      </div>
    </a>
  </div>`;



                new mapboxgl.Marker(el)
                    .setLngLat([longitude, latitude])
                    .setPopup(
                        new mapboxgl.Popup({ offset: 25 }).setHTML(popupHtml)
                    )
                    .addTo(map);
            });


        });

        mapRef.current = map;

        return () => {
            if (mapRef.current) {
                movingObjects.forEach((object) => {
                    if (map.getSource(`object-source-${object.id}`)) {
                        map.removeLayer(`object-layer-${object.id}`);
                        map.removeSource(`object-source-${object.id}`);
                    }
                    if (map.getSource(`object-line-source-${object.id}`)) {
                        map.removeLayer(`object-line-layer-${object.id}`);
                        map.removeSource(`object-line-source-${object.id}`);
                    }
                });
                map.remove();
            }
        };
    }, [markers, movingObjects]);

    const addMovingObjects = (map) => {
        movingObjects.forEach((object) => {
            // console.log(`Adding moving object: ${object.name}`);

            const geoJson = {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: object.coordinates,
                        },
                        properties: {
                            name: object.name,
                        },
                    },
                ],
            };

            if (!map.getSource(`object-source-${object.id}`)) {
                map.addSource(`object-source-${object.id}`, { type: "geojson", data: geoJson });

                map.addLayer({
                    id: `object-layer-${object.id}`,
                    type: "symbol",
                    source: `object-source-${object.id}`,
                    layout: {
                        "icon-image": "custom-marker",
                        "icon-size": 0.1,
                        "icon-allow-overlap": true,
                    },
                });
            } else {
                map.getSource(`object-source-${object.id}`).setData(geoJson);
            }

            if (!map.getSource(`object-line-source-${object.id}`)) {
                map.addSource(`object-line-source-${object.id}`, { type: "geojson", data: geoJson });

                map.addLayer({
                    id: `object-line-layer-${object.id}`,
                    type: "line",
                    source: `object-line-source-${object.id}`,
                    paint: {
                        "line-color": "#00ff00",
                        "line-width": 2,
                    },
                });
            } else {
                map.getSource(`object-line-source-${object.id}`).setData(geoJson);
            }
        });
    };

    return <div ref={mapContainerRef} className="relative w-full h-[500px]" />;
};

export default MapBoxComponent;

// <button class="absolute top-6 right-6 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white p-2">
//     <img src="/assets/images/unwishlist.svg" alt="wishlist" width="20" height="20">
// </button>