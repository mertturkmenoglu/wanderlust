import { icon } from '@/components/icons/leaflet';
import { Button } from '@/components/ui/button';
import { getRouteApi } from '@tanstack/react-router';
import { ExternalLinkIcon } from 'lucide-react';
import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';

export default function Map() {
  const route = getRouteApi('/p/$id/');
  const { poi } = route.useLoaderData();
  const lat = poi.address.lat;
  const lng = poi.address.lng;
  const zoom = 17;
  const url = `https://mt0.google.com/vt/scale=${window.devicePixelRatio}&hl=en&x={x}&y={y}&z={z}`;

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
        zoom={16}
        minZoom={4}
        scrollWheelZoom={true}
        style={{
          height: '400px',
          marginTop: '16px',
          zIndex: 0,
          width: '100%',
        }}
      >
        <TileLayer
          attribution=""
          url={url}
        />
        <Marker
          position={[lat, lng]}
          icon={icon}
        >
          <Tooltip
            direction="bottom"
            offset={[24, 48]}
            opacity={1}
          >
            {poi.name}
          </Tooltip>
        </Marker>
      </MapContainer>
    </div>
  );
}
