import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
    width: '100%',
    height: '250px',
  };
  
  const MapSection = ({ latitude, longitude }) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const defaultCenter = {
    lat: 25.276987,
    lng: 55.296249,
  };

  const center = (longitude && latitude) ? { lat: parseFloat(latitude), lng: parseFloat(longitude) } : defaultCenter;

    return (
    <div className="w-full rounded-lg">
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: latitude, lng: longitude }}
            zoom={10}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
            }}
          >
          {(longitude && latitude) && (
            <Marker position={center} />
          )}
          </GoogleMap>
        </LoadScript>
      </div>
  );
  }

  export default MapSection