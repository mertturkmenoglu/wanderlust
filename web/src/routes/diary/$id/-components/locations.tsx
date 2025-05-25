import AppMessage from '@/components/blocks/app-message';
import PoiCard from '@/components/blocks/poi-card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { getRouteApi, Link } from '@tanstack/react-router';
import { Grid2X2Icon, MapIcon } from 'lucide-react';
import { useState } from 'react';
import { Map } from './map.client';

export default function Locations() {
  const route = getRouteApi('/diary/$id/');
  const { entry } = route.useLoaderData();
  const [isGridMode, setIsGridMode] = useState(true);

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-xl font-medium">Locations</div>
        <div>
          <ToggleGroup
            type="single"
            disabled={entry.locations.length === 0}
            value={isGridMode ? 'grid' : 'map'}
            onValueChange={(v) => {
              if (v) {
                setIsGridMode(v === 'grid');
              }
            }}
          >
            <ToggleGroupItem
              value="grid"
              aria-label="Toggle bold"
            >
              <Grid2X2Icon className="h-4 w-4" />
              <span className="ml-1">Grid</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="map"
              aria-label="Toggle italic"
            >
              <MapIcon className="h-4 w-4" />
              <span className="ml-1">Map</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {entry.locations.length === 0 && (
        <AppMessage
          emptyMessage="No locations"
          showBackButton={false}
          className="mt-8"
        />
      )}

      {isGridMode ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {entry.locations.map((location) => (
            <Link
              to="/p/$id"
              key={location.poi.id}
              params={{
                id: location.poi.id,
              }}
            >
              <PoiCard poi={location.poi} />
              <div className="mt-4 text-muted-foreground">
                {location.description}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div>
          <Map locations={entry.locations} />
        </div>
      )}
    </>
  );
}
