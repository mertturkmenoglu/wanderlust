import type { components } from '@/lib/api-types';
import { createStyle } from '@/lib/map';
import MapContainer, { Marker } from 'react-map-gl/maplibre';

type Props = {
  bookmark: components['schemas']['GetUserBookmarksOutputBody']['bookmarks'][number];
};

export function BookmarkItemMap({ bookmark: { poi } }: Props) {
  return (
    <MapContainer
      initialViewState={{
        latitude: poi.address.lat,
        longitude: poi.address.lng,
        zoom: 15,
      }}
      dragPan={false}
      style={{
        width: '100%',
        height: '300px',
        zIndex: 0,
        marginTop: '16px',
      }}
      latitude={poi.address.lat}
      longitude={poi.address.lng}
      minZoom={12}
      mapStyle={createStyle('streets-v2-light')}
    >
      <Marker
        latitude={poi.address.lat}
        longitude={poi.address.lng}
      />
    </MapContainer>
  );
}
