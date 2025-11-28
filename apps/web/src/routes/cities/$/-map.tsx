import { createStyle } from '@/lib/map';
import MapContainer from 'react-map-gl/maplibre';

type Props = {
  latitude: number;
  longitude: number;
};

export function Map({ latitude, longitude }: Props) {
  return (
    <>
      <h3 className="text-2xl font-bold mt-8 lg:mt-4">Location</h3>
      <div className="mt-4">
        <MapContainer
          initialViewState={{
            latitude,
            longitude,
            zoom: 14,
            pitch: 0,
            bearing: 0,
          }}
          mapStyle={createStyle('streets-v2-light')}
          dragPan={false}
          dragRotate={false}
          minZoom={10}
          scrollZoom
          style={{
            height: '400px',
            marginTop: '16px',
            zIndex: 0,
            width: '100%',
          }}
        />
      </div>
    </>
  );
}
