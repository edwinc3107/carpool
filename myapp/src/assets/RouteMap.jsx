import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const limeIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function RouteMap({ ride }) {
  if (!ride) return null;

  console.log("RouteMap ride prop:", ride);


  const points = [
    ride.fromCoords,
    ...(ride.intermediateStops || []),
    ride.toCoords
  ];

  const validPoints = points.filter(p => p && typeof p.lat === 'number' && typeof p.lng === 'number');
  if (validPoints.length === 0) return null;

  const polyline = validPoints.map(p => [p.lat, p.lng]);
  const center = polyline[0];

  return (
    <div className="my-10">
      <MapContainer center={center} zoom={7} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {validPoints.map((p, idx) => (
          <Marker key={idx} position={[p.lat, p.lng]} icon={limeIcon} />
        ))}
        <Polyline positions={polyline} color="lime" weight={4} />
      </MapContainer>
    </div>
  );
}
