import AppMessage from '@/components/blocks/app-message';
import PoiCard from '@/components/blocks/poi-card';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { LoaderCircleIcon } from 'lucide-react';
import { useGeoSearch } from 'react-instantsearch';
import { MapContainer, TileLayer } from 'react-leaflet';
import GeoSearch from './geo-search';

export default function Container() {
  const url = `https://mt0.google.com/vt/scale=${window.devicePixelRatio}&hl=en&x={x}&y={y}&z={z}`;
  const { items } = useGeoSearch();

  const query = useQuery({
    queryKey: ['geolocation-permission'],
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
          },
        );
      });
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  if (query.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <LoaderCircleIcon className="mx-auto mt-32 size-12 animate-spin text-primary" />
        <div className="text-sm mt-8 mb-32">Allow access to your location</div>
      </div>
    );
  }

  if (query.error) {
    return (
      <div className="flex flex-col items-center justify-center">
        <AppMessage
          emptyMessage={
            query.error.message ?? 'Give permission to access your location'
          }
          showBackButton={false}
          className="mt-32"
        />
        <Button
          variant="link"
          className="mb-32"
          onClick={() => query.refetch()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <MapContainer
        center={query.data}
        zoom={14}
        minZoom={4}
        className="mt-4"
        scrollWheelZoom={true}
        style={{
          height: '600px',
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={url}
        />
        <GeoSearch />
      </MapContainer>

      <div className="mt-8 max-w-4xl  mx-auto">
        {items.length === 0 && (
          <AppMessage
            emptyMessage="No nearby locations found"
            showBackButton={false}
            className="mt-4"
          />
        )}
        <ScrollArea className="mt-4 h-[600px]">
          <div className="grid md:grid-cols-2 gap-8 pr-4">
            {items.map((item) => (
              <Link
                to="/p/$id"
                key={item.poi.id}
                params={{
                  id: item.poi.id,
                }}
              >
                <PoiCard poi={item.poi} />
              </Link>
            ))}
          </div>
          <ScrollBar />
        </ScrollArea>
      </div>
    </div>
  );
}
