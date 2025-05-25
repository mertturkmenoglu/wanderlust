import { Button } from '@/components/ui/button';
import { getRouteApi } from '@tanstack/react-router';
import { ExternalLinkIcon } from 'lucide-react';
import { Map } from './map.client';

export default function MapContainer() {
  const route = getRouteApi('/p/$id/');
  const { poi } = route.useLoaderData();
  const lat = poi.address.lat;
  const lng = poi.address.lng;
  const zoom = 17;

  return (
    <>
      <div className="flex items-end justify-between">
        <h3 className="text-xl font-semibold">Location</h3>
        <Button
          variant="link"
          className="px-0"
          size="sm"
          asChild
        >
          <a
            href={`https://www.google.com/maps/@${lat},${lng},${zoom}z`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLinkIcon className="size-3" />
            <span className="ml-1">Open in Maps</span>
          </a>
        </Button>
      </div>
      <Map
        lat={lat}
        lng={lng}
      />
    </>
  );
}
