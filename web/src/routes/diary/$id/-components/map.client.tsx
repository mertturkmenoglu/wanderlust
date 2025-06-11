import { icon } from '@/components/icons/leaflet';
import type { components } from '@/lib/api-types';
import { tileUrl } from '@/lib/map';
import { Link } from '@tanstack/react-router';
import type { LatLngTuple } from 'leaflet';
import 'leaflet-defaulticon-compatibility';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

type Props = {
  locations: components['schemas']['DiaryLocation'][];
};

export function Map({ locations }: Props) {
  const fst = locations[0];
  const center: LatLngTuple =
    fst === undefined ? [0, 0] : [fst.poi.address.lat, fst.poi.address.lng];

  return (
    <div className="mt-4">
      <MapContainer
        center={center}
        zoom={14}
        minZoom={4}
        scrollWheelZoom
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
        {locations.map((location) => (
          <Marker
            key={location.poi.id}
            position={[location.poi.address.lat, location.poi.address.lng]}
            icon={icon}
          >
            <Popup>
              <Link
                to="/p/$id"
                params={{
                  id: location.poi.id,
                }}
              >
                {location.poi.name}
              </Link>
              <div>{location.description ?? 'No description'}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
