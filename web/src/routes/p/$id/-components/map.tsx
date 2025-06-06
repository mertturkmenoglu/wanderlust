import { icon } from '@/components/icons/leaflet';
import { Button } from '@/components/ui/button';
import { tileUrl } from '@/lib/map';
import { getRouteApi } from '@tanstack/react-router';
import { ExternalLinkIcon } from 'lucide-react';
import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';

export default function Map() {
  const route = getRouteApi('/p/$id/');
  const { poi } = route.useLoaderData();
  const lat = poi.address.lat;
  const lng = poi.address.lng;
  const zoom = 17;

  return (
    <div>
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
      <MapContainer
        center={[lat, lng]}
        zoom={18}
        minZoom={1}
        style={{
          height: '400px',
          marginTop: '16px',
          zIndex: 0,
          width: '100%',
        }}
      >
        <TileLayer
          attribution=""
          url={tileUrl}
        />
        <Marker
          position={[lat, lng]}
          icon={icon}
        >
          <Tooltip
            direction="bottom"
            opacity={1}
          >
            {poi.name}
          </Tooltip>
        </Marker>
      </MapContainer>
    </div>
  );
}
