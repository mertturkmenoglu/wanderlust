import { PoiCard } from '@/components/blocks/poi-card';
import { icon } from '@/components/icons/leaflet';
import { Link } from '@tanstack/react-router';
import type { LeafletEvent } from 'leaflet';
import { type UseGeoSearchProps, useGeoSearch } from 'react-instantsearch';
import { Marker, Popup, useMapEvents } from 'react-leaflet';

export function GeoSearch(props: UseGeoSearchProps) {
  const { items, refine } = useGeoSearch(props);

  function onViewChange({ target }: LeafletEvent) {
    refine({
      northEast: target.getBounds().getNorthEast(),
      southWest: target.getBounds().getSouthWest(),
    });
  }

  useMapEvents({ zoomend: onViewChange, dragend: onViewChange });

  return (
    <>
      {items.map((item) => (
        <Marker
          key={item.objectID}
          position={item._geoloc}
          icon={icon}
        >
          <Popup className="min-w-md flex items-center !text-primary">
            <Link
              to="/p/$id"
              className="text-primary"
              params={{
                id: item.poi.id,
              }}
            >
              <PoiCard
                poi={item.poi}
                hoverEffects={false}
              />
            </Link>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
