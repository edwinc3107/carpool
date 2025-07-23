// src/MapTest.jsx
import React from "react";
import RouteMap from "./Map";

function MapTest() {
  const testFrom = { lat: 40.7128, lng: -74.006 };     // New York
  const testTo = { lat: 42.3601, lng: -71.0589 };       // Boston

  const testStops = [
    { lat: 41.2033, lng: -77.1945, address: "Pennsylvania" }, // Example midpoint
  ];

  return (
    <div className="w-full h-screen">
      <h1 className="text-2xl font-bold text-center mt-4">🚗 Route Map Test</h1>
      <RouteMap fromCoords={testFrom} toCoords={testTo} intermediateStops={testStops} />
    </div>
  );
}

export default MapTest;
