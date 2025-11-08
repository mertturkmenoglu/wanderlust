import { PlaceCard } from '@/components/blocks/place-card';
import { Link } from '@tanstack/react-router';
import type { MapLibreEvent } from 'maplibre-gl';
import { useEffect, useState } from 'react';
import { type UseGeoSearchProps, useGeoSearch } from 'react-instantsearch';
import { Marker, Popup, useMap } from 'react-map-gl/maplibre';

export function GeoSearch(props: UseGeoSearchProps) {
  const { items, refine } = useGeoSearch(props);
  const { current: map } = useMap();
  const [itemIndex, setItemIndex] = useState(-1);

  function onViewChange({ target }: MapLibreEvent) {
    refine({
      northEast: target.getBounds().getNorthEast(),
      southWest: target.getBounds().getSouthWest(),
    });
  }

  useEffect(() => {
    map?.on('zoomend', onViewChange);
    map?.on('dragend', onViewChange);

    // Cleanup on unmount
    return () => {
      map?.off('zoomend', onViewChange);
      map?.off('dragend', onViewChange);
    };
  }, [map, onViewChange]);

  return (
    <>
      {items.map((item, i) => (
        <Marker
          key={item.objectID}
          latitude={item._geoloc.lat}
          longitude={item._geoloc.lng}
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setItemIndex(i);
          }}
        ></Marker>
      ))}

      {itemIndex !== -1 && (
        <Popup
          latitude={items[itemIndex]!._geoloc.lat}
          longitude={items[itemIndex]!._geoloc.lng}
          className="min-w-md flex items-center text-primary!"
        >
          <Link
            to="/p/$id"
            className="text-primary"
            params={{
              id: items[itemIndex]!.place.id,
            }}
          >
            <PlaceCard
              place={items[itemIndex]!.place}
              hoverEffects={false}
            />
          </Link>
        </Popup>
      )}
    </>
  );
}
