import { useLoaderData } from "react-router";
import { ExternalLinkIcon } from "lucide-react";
import { ClientOnly } from "remix-utils/client-only";
import { Button } from "~/components/ui/button";
import { loader } from "../route";
import { Map } from "./map.client";

export default function MapContainer() {
  const { poi } = useLoaderData<typeof loader>();
  const lat = poi.address.lat;
  const lng = poi.address.lng;
  const zoom = 17;

  return (
    <>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold">Location</h3>
        <Button variant="link" className="px-0" size="sm" asChild>
          <a href={`https://www.google.com/maps/@${lat},${lng},${zoom}z`}>
            <ExternalLinkIcon className="size-3" />
            <span className="ml-1">Open in Maps</span>
          </a>
        </Button>
      </div>
      <ClientOnly fallback={<div className="w-full h-[400px] bg-muted mt-4" />}>
        {() => <Map lat={lat} lng={lng} />}
      </ClientOnly>
    </>
  );
}
