import MapContainer, { Marker } from 'react-map-gl/maplibre';
import { Button } from '@/components/ui/button';
import { getRouteApi } from '@tanstack/react-router';
import { ExternalLinkIcon } from 'lucide-react';
import mapPinIcon from '@/map-pin.svg';
import { createStyle } from '@/lib/map';

export function Map() {
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
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom,
        }}
        dragPan={false}
        pitch={0}
        dragRotate={false}
        minZoom={14}
        style={{ width: '100%', height: '400px', marginTop: '16px', zIndex: 0 }}
        mapStyle={createStyle('streets-v2-light')}
      >
        <Marker
          latitude={lat}
          longitude={lng}
        >
          <img
            src={mapPinIcon}
            alt="map pin"
          />
        </Marker>
      </MapContainer>
    </div>
  );
}

