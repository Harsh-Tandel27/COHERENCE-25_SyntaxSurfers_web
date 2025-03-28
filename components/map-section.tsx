"use client"

import { useEffect, useRef, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Hospital, MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data for emergency locations
const emergencyLocations = [
  { id: 1, name: "Central Hospital", type: "hospital", lat: 40.7128, lng: -74.006 },
  { id: 2, name: "North Fire Station", type: "fire", lat: 40.7228, lng: -74.016 },
  { id: 3, name: "East Police Station", type: "police", lat: 40.7148, lng: -73.996 },
  { id: 4, name: "South Medical Center", type: "hospital", lat: 40.7028, lng: -74.006 },
]

// Mock data for traffic incidents
const trafficIncidents = [
  { id: 1, description: "Major accident on Main St", severity: "high", lat: 40.7138, lng: -74.016 },
  { id: 2, description: "Road construction on 5th Ave", severity: "medium", lat: 40.7228, lng: -74.026 },
  { id: 3, description: "Traffic congestion on Broadway", severity: "low", lat: 40.7048, lng: -73.986 },
]

export function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("traffic")

  useEffect(() => {
    // In a real implementation, you would load the Google Maps API here
    // and initialize the map with traffic layers, markers, etc.
    const loadMap = async () => {
      // Simulate loading the map
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setMapLoaded(true)
    }

    loadMap()
  }, [])

  return (
    <div className="relative h-full">
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

      <div className="absolute bottom-4 left-4 z-10">
        <Button size="sm" variant="secondary" className="shadow-lg">
          <Navigation className="h-4 w-4 mr-2" />
          Current Location
        </Button>
      </div>

      <div ref={mapRef} className="h-full w-full bg-gray-100">
        {!mapLoaded ? (
          <div className="h-full w-full flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <div className="h-full w-full relative">
            {/* This would be replaced with the actual Google Maps component */}
            <img
              src="/placeholder.svg?height=500&width=800"
              alt="Map placeholder"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/5"></div>

            {/* Simulated map markers */}
            {activeTab === "emergency" &&
              emergencyLocations.map((location) => (
                <div
                  key={location.id}
                  className="absolute w-4 h-4 rounded-full animate-pulse"
                  style={{
                    top: `${Math.random() * 80 + 10}%`,
                    left: `${Math.random() * 80 + 10}%`,
                    backgroundColor:
                      location.type === "hospital" ? "red" : location.type === "fire" ? "orange" : "blue",
                  }}
                />
              ))}

            {activeTab === "traffic" &&
              trafficIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="absolute w-4 h-4 rounded-full animate-pulse"
                  style={{
                    top: `${Math.random() * 80 + 10}%`,
                    left: `${Math.random() * 80 + 10}%`,
                    backgroundColor:
                      incident.severity === "high" ? "red" : incident.severity === "medium" ? "orange" : "blue",
                  }}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

