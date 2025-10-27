import type { components } from '@/lib/api-types';
import { createStyle } from '@/lib/map';
import { Link } from '@tanstack/react-router';
import type { LngLatLike } from 'maplibre-gl';
import MapContainer, { Marker, Popup } from 'react-map-gl/maplibre';
import { useState } from 'react';

type Props = {
  locations: components['schemas']['DiaryLocation'][];
};

export function Map({ locations }: Props) {
  const fst = locations[0];
  const center: LngLatLike =
    fst === undefined ? [0, 0] : [fst.poi.address.lat, fst.poi.address.lng];
  const [locPopupIndex, setLocPopupIndex] = useState(-1);

  return (
    <div className="mt-4">
      <MapContainer
        initialViewState={{
          longitude: center[1],
          latitude: center[0],
          zoom: 14,
          pitch: 0,
          bearing: 0,
        }}
        mapStyle={createStyle('streets-v2-light')}
        // minZoom={10}
        style={{
          height: '400px',
          marginTop: '16px',
          zIndex: 0,
          width: '100%',
        }}
      >
        {locations.map((location, i) => (
          <Marker
            key={location.poi.id}
            latitude={location.poi.address.lat}
            longitude={location.poi.address.lng}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setLocPopupIndex(i);
            }}
          ></Marker>
        ))}

        {locPopupIndex !== -1 && (
          <Popup
            longitude={locations[locPopupIndex]!.poi.address.lng}
            latitude={locations[locPopupIndex]!.poi.address.lat}
            onClose={() => setLocPopupIndex(-1)}
          >
            <Link
              to="/p/$id"
              params={{
                id: locations[locPopupIndex]!.poi.id,
              }}
              className="text-primary underline"
            >
              {locations[locPopupIndex]!.poi.name}
            </Link>
            <div>
              {locations[locPopupIndex]!.description ?? 'No description'}
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
}
