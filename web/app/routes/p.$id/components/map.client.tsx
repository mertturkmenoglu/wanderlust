import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import { MapContainer, TileLayer } from "react-leaflet";

type Props = {
  lat: number;
  lng: number;
};

export function Map({ lat, lng }: Props) {
  const url = `https://mt0.google.com/vt/scale=${window.devicePixelRatio}&hl=en&x={x}&y={y}&z={z}`;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold">Location</h3>
      <MapContainer
        center={[lat, lng]}
        zoom={16}
        minZoom={4}
        scrollWheelZoom={true}
        style={{
          height: "400px",
          marginTop: "16px",
        }}
      >
        <TileLayer attribution="" url={url} />
      </MapContainer>
    </div>
  );
}
