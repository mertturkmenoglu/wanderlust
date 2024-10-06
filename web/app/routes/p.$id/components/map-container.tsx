import { ClientOnly } from "remix-utils/client-only";
import { Map } from "./map.client";

type Props = {
  lat: number;
  lng: number;
};

export default function MapContainer({ lat, lng }: Props) {
  return (
    <>
      <h3 className="text-2xl font-bold">Location</h3>
      <ClientOnly fallback={<div className="w-full h-[400px] bg-muted mt-8" />}>
        {() => <Map lat={lat} lng={lng} />}
      </ClientOnly>
    </>
  );
}
