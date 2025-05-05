import { Link } from "react-router";
import { LatLngTuple } from "leaflet";
import "leaflet-defaulticon-compatibility";

import { useEffect, useState } from "react";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { DiaryLocationDto } from "~/lib/dto";

type Props = {
  locations: DiaryLocationDto[];
};

export function Map({ locations }: Props) {
  const [componentLoading, setComponentLoading] = useState(true);
  const url = `https://mt0.google.com/vt/scale=${window.devicePixelRatio}&hl=en&x={x}&y={y}&z={z}`;

  useEffect(() => {
    setComponentLoading(false);
  }, []);

  const fst = locations[0];
  const center: LatLngTuple =
    fst !== undefined ? [fst.poi.address.lat, fst.poi.address.lng] : [0, 0];

  return (
    <div className="mt-4">
      {componentLoading ? (
        <div className="bg-muted w-full h-[400px] mt-4"></div>
      ) : (
        <MapContainer
          center={center}
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
          {locations.map((location) => (
            <Marker
              key={location.poi.id}
              position={[location.poi.address.lat, location.poi.address.lng]}
            >
              <Popup>
                <Link to={`/p/${location.poi.id}`}>{location.poi.name}</Link>
                <div>{location.description ?? "No description"}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
