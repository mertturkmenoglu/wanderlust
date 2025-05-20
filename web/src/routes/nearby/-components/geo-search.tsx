import { Link } from '@tanstack/react-router';
import { type LeafletEvent } from 'leaflet';
import { type UseGeoSearchProps, useGeoSearch } from 'react-instantsearch';
import { Marker, Popup, useMapEvents } from 'react-leaflet';

export default function GeoSearch(props: UseGeoSearchProps) {
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
        >
          <Popup>
            <Link
              to="/p/$id"
              params={{
                id: item.poi.id,
              }}
            >
              {item.name}
            </Link>
            <div>{item.poi.description.slice(0, 100)}...</div>
            <div>
              {item.poi.address.city.name}, {item.poi.address.city.state.name} /{' '}
              {item.poi.address.city.country.name}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
