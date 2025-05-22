import type { components } from '@/lib/api-types';
import { Link } from '@tanstack/react-router';
import type { LatLngTuple } from 'leaflet';
import 'leaflet-defaulticon-compatibility';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

type Props = {
  locations: components['schemas']['DiaryLocation'][];
};

export function Map({ locations }: Props) {
  const url = `https://mt0.google.com/vt/scale=${window.devicePixelRatio}&hl=en&x={x}&y={y}&z={z}`;

  const fst = locations[0];
  const center: LatLngTuple =
    fst !== undefined ? [fst.poi.address.lat, fst.poi.address.lng] : [0, 0];

  return (
    <div className="mt-4">
      <MapContainer
        center={center}
        zoom={14}
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
        {locations.map((location) => (
          <Marker
            key={location.poi.id}
            position={[location.poi.address.lat, location.poi.address.lng]}
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
