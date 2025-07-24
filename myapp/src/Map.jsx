import React from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function RouteMap({ fromCoords, toCoords, intermediateStops = [] }) {
  if (!fromCoords || !toCoords) return <p>No coordinates to show map.</p>;
  console.log("From:", fromCoords);
  console.log("To:", toCoords);
  console.log("Stops:", intermediateStops);


  const routePoints = [
    [fromCoords.lat, fromCoords.lng],
    ...intermediateStops.map(stop => [stop.lat, stop.lng]),
    [toCoords.lat, toCoords.lng],
  ];

  return (
    <MapContainer
      center={routePoints[0]}
      zoom={7}
      scrollWheelZoom={false}
      style={{ height: "200px", width: "100%", marginTop: "2rem", borderRadius: "1rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {routePoints.map((pos, idx) => (
        <Marker key={idx} position={pos}>
          <Popup>
            {idx === 0
              ? "Start"
              : idx === routePoints.length - 1
              ? "Destination"
              : `Stop ${idx}`}
          </Popup>
        </Marker>
      ))}

      <Polyline positions={routePoints} color="lime" weight={4} />
    </MapContainer>
  );
}

export default RouteMap;
