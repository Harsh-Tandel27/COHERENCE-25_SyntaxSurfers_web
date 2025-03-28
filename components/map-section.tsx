"use client";

import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Hospital, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

// Load API key from environment variables
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const mapContainerStyle = { width: "100%", height: "100vh" };
const defaultCenter = { lat: 40.7128, lng: -74.006 };

// Mock data for emergency locations
const emergencyLocations = [
  { id: 1, name: "Central Hospital", type: "hospital", lat: 40.7128, lng: -74.006 },
  { id: 2, name: "North Fire Station", type: "fire", lat: 40.7228, lng: -74.016 },
  { id: 3, name: "East Police Station", type: "police", lat: 40.7148, lng: -73.996 },
  { id: 4, name: "South Medical Center", type: "hospital", lat: 40.7028, lng: -74.006 },
];

// Mock data for traffic incidents
const trafficIncidents = [
  { id: 1, description: "Major accident on Main St", severity: "high", lat: 40.7138, lng: -74.016 },
  { id: 2, description: "Road construction on 5th Ave", severity: "medium", lat: 40.7228, lng: -74.026 },
  { id: 3, description: "Traffic congestion on Broadway", severity: "low", lat: 40.7048, lng: -73.986 },
];

export function MapSection() {
  const [activeTab, setActiveTab] = useState("traffic");
  const [currentLocation, setCurrentLocation] = useState(defaultCenter);
  const [markerIcons, setMarkerIcons] = useState<{ [key: string]: google.maps.Icon }>({});

  // Get user's current location
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error.message, error.code);
          alert(`Error fetching location: ${error.message} (Code: ${error.code})`);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by your browser.");
    }
  };
  
  // Load marker icons once Google Maps is available
  useEffect(() => {
    if (window.google) {
      setMarkerIcons({
        high: {
          url: "/red-marker.png",
          scaledSize: new window.google.maps.Size(30, 30),
        },
        medium: {
          url: "/orange-marker.png",
          scaledSize: new window.google.maps.Size(30, 30),
        },
        low: {
          url: "/blue-marker.png",
          scaledSize: new window.google.maps.Size(30, 30),
        },
        hospital: {
          url: "/hospital-marker.png",
          scaledSize: new window.google.maps.Size(30, 30),
        },
        fire: {
          url: "/fire-marker.png",
          scaledSize: new window.google.maps.Size(30, 30),
        },
        police: {
          url: "/police-marker.png",
          scaledSize: new window.google.maps.Size(30, 30),
        },
        user: {
          url: "/current-location.png",
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });
    }
  }, []);

  return (
    <div className="relative h-full">
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap mapContainerStyle={mapContainerStyle} center={currentLocation} zoom={12}>
          {/* Traffic Incidents Markers */}
          {activeTab === "traffic" &&
            trafficIncidents.map((incident) => (
              <Marker
                key={incident.id}
                position={{ lat: incident.lat, lng: incident.lng }}
                icon={markerIcons[incident.severity]}
              />
            ))}

          {/* Emergency Locations Markers */}
          {activeTab === "emergency" &&
            emergencyLocations.map((location) => (
              <Marker
                key={location.id}
                position={{ lat: location.lat, lng: location.lng }}
                icon={markerIcons[location.type]}
              />
            ))}

          {/* User's Current Location Marker */}
          <Marker position={currentLocation} icon={markerIcons["user"]} />
        </GoogleMap>
      </LoadScript>

      {/* Tabs for switching views */}
      <div className="absolute top-4 right-4 z-10">
        <Tabs
          defaultValue="traffic"
          className="w-[250px] bg-white/90 backdrop-blur-sm rounded-lg shadow-lg"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
          </TabsList>
          <TabsContent value="traffic" className="p-4">
            <h4 className="font-medium mb-2">Traffic Incidents</h4>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {trafficIncidents.map((incident) => (
                <div key={incident.id} className="flex items-start gap-2 text-sm">
                  <AlertTriangle
                    className={`h-4 w-4 mt-0.5 ${
                      incident.severity === "high"
                        ? "text-red-500"
                        : incident.severity === "medium"
                        ? "text-amber-500"
                        : "text-blue-500"
                    }`}
                  />
                  <div>
                    <p>{incident.description}</p>
                    <Badge variant="outline" className="mt-1">
                      {incident.severity} severity
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="emergency" className="p-4">
            <h4 className="font-medium mb-2">Emergency Locations</h4>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {emergencyLocations.map((location) => (
                <div key={location.id} className="flex items-start gap-2 text-sm">
                  {location.type === "hospital" ? (
                    <Hospital className="h-4 w-4 mt-0.5 text-red-500" />
                  ) : location.type === "fire" ? (
                    <AlertTriangle className="h-4 w-4 mt-0.5 text-orange-500" />
                  ) : (
                    <MapPin className="h-4 w-4 mt-0.5 text-blue-500" />
                  )}
                  <div>
                    <p>{location.name}</p>
                    <Badge variant="outline" className="mt-1 capitalize">
                      {location.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Button to get current location */}
      <div className="absolute bottom-4 left-4 z-10">
        <Button size="sm" variant="secondary" className="shadow-lg" onClick={handleCurrentLocation}>
          <Navigation className="h-4 w-4 mr-2" />
          Current Location
        </Button>
      </div>
    </div>
  );
}
