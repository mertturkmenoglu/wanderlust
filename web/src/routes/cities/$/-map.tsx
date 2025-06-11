import { tileUrl } from '@/lib/map';
import { MapContainer, TileLayer } from 'react-leaflet';

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
          center={[latitude, longitude]}
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
        </MapContainer>
      </div>
    </>
  );
}
