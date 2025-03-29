"use client"

import { Button } from "@/components/ui/button"
import { useGeoLocation } from "@/hooks/useGeoLoc"
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"
import { Navigation } from "lucide-react"
import { useEffect, useState } from "react"

// Load API key from environment variables
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string

const mapContainerStyle = { width: "100%", height: "100vh" }

export function MapSection() {
  const [activeTab, setActiveTab] = useState("traffic")
  const { location } = useGeoLocation()
  const [currentLocation, setCurrentLocation] = useState({
    lat: 19.3835727,
    lng: 72.8294563,
  })
  const [markerIcons, setMarkerIcons] = useState<{
    [key: string]: google.maps.Icon
  }>({})
  const [geoPermission, setGeoPermission] = useState<"granted" | "denied" | "prompt">("prompt")

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setGeoPermission(result.state)
        result.onchange = () => setGeoPermission(result.state)
      })
    }
  }, [])

  useEffect(() => {
    if (geoPermission === "granted" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Geolocation error:", error)
        },
      )
    } else if (geoPermission === "denied") {
      console.error("Geolocation permission denied.")
    }
  }, [geoPermission])

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
      })
    }
  }, [])

  return (
    <div className="relative h-full">
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        {geoPermission === "denied" ? (
          <div className="flex items-center justify-center h-full">
            <p>Geolocation permission is denied. Please enable it in your browser settings.</p>
          </div>
        ) : currentLocation ? (
          <GoogleMap mapContainerStyle={mapContainerStyle} center={currentLocation} zoom={12}>
            {/* User's Current Location Marker */}
            <Marker position={currentLocation} icon={markerIcons["user"]} />
          </GoogleMap>
        ) : (
          "Fetching location..."
        )}
      </LoadScript>

      {/* Button to get current location */}
      <div className="absolute bottom-4 left-4 z-10">
        <Button
          size="sm"
          variant="secondary"
          className="shadow-lg"
          // onClick={handleCurrentLocation}
        >
          <Navigation className="h-4 w-4 mr-2" />
          Current Location
        </Button>
      </div>
    </div>
  )
}

