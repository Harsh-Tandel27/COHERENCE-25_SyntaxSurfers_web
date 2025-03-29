"use client";

import { Button } from "@/components/ui/button";
import { GoogleMap, LoadScript, TrafficLayer } from "@react-google-maps/api";
import { Navigation } from "lucide-react";
import { useEffect, useState } from "react";

// Load API key from environment variables
const GOOGLE_MAPS_API_KEY = process.env
  .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const mapContainerStyle = { width: "100%", height: "100%" };

interface TrafficMapProps {
  location: { lat: number; lng: number };
}

export default function TrafficMap({ location }: TrafficMapProps) {
  const [currentLocation, setCurrentLocation] = useState(location);
  const [geoPermission, setGeoPermission] = useState<
    "granted" | "denied" | "prompt"
  >("prompt");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrentLocation(location);
  }, [location]);

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setGeoPermission(result.state);
        result.onchange = () => setGeoPermission(result.state);
      });
    }
  }, []);

  const handleCurrentLocation = () => {
    setIsLoading(true);
    if (geoPermission === "granted" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLoading(false);
        }
      );
    } else if (geoPermission === "denied") {
      console.error("Geolocation permission denied.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-full">
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        {geoPermission === "denied" ? (
          <div className="flex items-center justify-center h-full">
            <p>
              Geolocation permission is denied. Please enable it in your browser
              settings.
            </p>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={currentLocation}
            zoom={13}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
            }}
            mapTypeId="terrain"
          >
            {/* Traffic Layer */}
            <TrafficLayer />
          </GoogleMap>
        )}
      </LoadScript>

      {/* Button to get current location */}
      <div className="absolute bottom-4 left-4 z-10">
        <Button
          size="sm"
          variant="secondary"
          className="shadow-lg"
          onClick={handleCurrentLocation}
          disabled={isLoading}
        >
          <Navigation className="h-4 w-4 mr-2" />
          {isLoading ? "Locating..." : "Current Location"}
        </Button>
      </div>
    </div>
  );
}
