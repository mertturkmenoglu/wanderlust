import { useQuery } from "@tanstack/react-query";
import "leaflet-defaulticon-compatibility";
import { LoaderCircleIcon } from "lucide-react";
import { MapContainer, TileLayer } from "react-leaflet";
import AppMessage from "~/components/blocks/app-message";
import GeoSearch from "./geo-search.client";

export default function Container() {
  const url = `https://mt0.google.com/vt/scale=${window.devicePixelRatio}&hl=en&x={x}&y={y}&z={z}`;

  const query = useQuery({
    queryKey: ["geolocation-permission"],
    queryFn: async () => {
      return new Promise<[number, number]>((res, rej) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            return res([pos.coords.latitude, pos.coords.longitude]);
          },
          (err) => {
            return rej(err.message);
          },
          {
            timeout: 100_000,
          }
        );
      });
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  if (query.isLoading) {
    return (
      <LoaderCircleIcon className="mx-auto my-16 size-8 animate-spin text-primary" />
    );
  }

  if (query.error) {
    return (
      <AppMessage errorMessage={query.error.message} showBackButton={false} />
    );
  }

  return (
    <MapContainer
      center={query.data}
      zoom={14}
      minZoom={4}
      className="mt-4"
      scrollWheelZoom={true}
      style={{
        height: "600px",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={url}
      />
      <GeoSearch />
    </MapContainer>
  );
}
