import { useLoaderData } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import { loader } from "../route";
import { Map } from "./map.client";

export default function MapContainer() {
  const { poi } = useLoaderData<typeof loader>();
  const lat = poi.address.lat;
  const lng = poi.address.lng;

  return (
    <>
      <h3 className="text-2xl font-bold">Location</h3>
      <ClientOnly fallback={<div className="w-full h-[400px] bg-muted mt-4" />}>
        {() => <Map lat={lat} lng={lng} />}
      </ClientOnly>
    </>
  );
}
