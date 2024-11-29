import "leaflet-defaulticon-compatibility";
import { useEffect, useState } from "react";

import { MapContainer, TileLayer } from "react-leaflet";

type Props = {
  lat: number;
  lng: number;
};

export function Map({ lat, lng }: Props) {
  const [componentLoading, setComponentLoading] = useState(true);
  const url = `https://mt0.google.com/vt/scale=${window.devicePixelRatio}&hl=en&x={x}&y={y}&z={z}`;

  useEffect(() => {
    setComponentLoading(false);
  }, []);

  return (
    <div className="mt-4">
      {componentLoading ? (
        <div className="bg-muted w-full h-[400px] mt-4"></div>
      ) : (
        <MapContainer
          center={[lat, lng]}
          zoom={14}
          minZoom={4}
          scrollWheelZoom={true}
          style={{
            height: "400px",
            marginTop: "16px",
            zIndex: 0,
            width: "100%",
          }}
        >
          <TileLayer attribution="" url={url} />
        </MapContainer>
      )}
    </div>
  );
}
