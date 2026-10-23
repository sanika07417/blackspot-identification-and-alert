import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

const COLORS = { safe: "#16845B", caution: "#F2A900", danger: "#D93636", navy: "#142B3B" };

const pinIcon = L.divIcon({
  className: "",
  html: `<div style="width:22px;height:22px;border-radius:50% 50% 50% 0;background:${COLORS.danger};transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

function FlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.6 });
  }, [center[0], center[1], zoom]);
  return null;
}
function ClickCatcher({ onPick }) {
  useMapEvents({ click: (e) => onPick(+e.latlng.lat.toFixed(5), +e.latlng.lng.toFixed(5)) });
  return null;
}

export default function MapView({
  points = [],
  center = [16.77, 74.55],
  zoom = 11,
  onSelect,
  selectedId,
  heat = false,
  pin,
  onPick,
  className = "h-full w-full",
}) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom className={className}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyTo center={center} zoom={zoom} />
      {onPick && <ClickCatcher onPick={onPick} />}
      {heat &&
        points.map((p) => (
          <CircleMarker
            key={`h-${p.id}`}
            center={[p.lat, p.lng]}
            radius={(p.radius ?? 10) * 3}
            pathOptions={{ stroke: false, fillColor: COLORS[p.color], fillOpacity: 0.18 }}
          />
        ))}
      {points.map((p) => (
        <CircleMarker
          key={p.id}
          center={[p.lat, p.lng]}
          radius={p.radius ?? 10}
          pathOptions={{
            color: selectedId === p.id ? COLORS.navy : "#fff",
            weight: selectedId === p.id ? 4 : 2,
            fillColor: COLORS[p.color],
            fillOpacity: 0.9,
          }}
          eventHandlers={{ click: () => onSelect?.(p.id) }}
        >
          <Tooltip direction="top" offset={[0, -6]}>
            <b>{p.label}</b>
            {p.sub && (
              <>
                <br />
                {p.sub}
              </>
            )}
          </Tooltip>
        </CircleMarker>
      ))}
      {pin && (
        <Marker position={pin} icon={pinIcon}>
          <Popup>Selected location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
