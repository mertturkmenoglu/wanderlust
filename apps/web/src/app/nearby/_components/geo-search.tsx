import { LeafletEvent } from 'leaflet';
import Link from 'next/link';
import { UseGeoSearchProps, useGeoSearch } from 'react-instantsearch';
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
            <Link href={`/location/${item.id}`}>{item.name}</Link>
            <div>{item.description.slice(0, 100)}...</div>
            <div>
              {item.address.city}, {item.address.state} / {item.address.country}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
