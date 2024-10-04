import { ClientOnly } from "remix-utils/client-only";
import { Map } from "./map.client";

type Props = {
  lat: number;
  lng: number;
};

export default function MapContainer({ lat, lng }: Props) {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      {() => <Map lat={lat} lng={lng} />}
    </ClientOnly>
  );
}
