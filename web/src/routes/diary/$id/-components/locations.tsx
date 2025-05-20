import PoiCard from '@/components/blocks/poi-card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { getRouteApi, Link } from '@tanstack/react-router';
import { Grid2X2Icon, MapIcon } from 'lucide-react';
import { useState } from 'react';
import { Map } from './map.client';

type DisplayMode = 'grid' | 'map';

export default function Locations() {
  const route = getRouteApi('/diary/$id/');
  const { entry } = route.useLoaderData();
  const [displayMode, setDisplayMode] = useState<DisplayMode>('grid');

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-xl font-medium">Locations</div>
        <div>
          <ToggleGroup
            type="single"
            value={displayMode}
            onValueChange={(v) => {
              if (v) {
                setDisplayMode(v === 'grid' ? v : 'map');
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

      {displayMode === 'grid' ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entry.locations.map((location) => (
            <Link
              to="/p/$id"
              key={location.poi.id}
              params={{
                id: location.poi.id,
              }}
            >
              <PoiCard
                poi={{
                  ...location.poi,
                  image: {
                    url: location.poi.media[0]?.url ?? '',
                    alt: location.poi.media[0]?.alt ?? '',
                  },
                }}
              />
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
