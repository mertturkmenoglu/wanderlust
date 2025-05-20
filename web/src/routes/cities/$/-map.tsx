import { MapContainer, TileLayer } from 'react-leaflet';

type Props = {
  latitude: number;
  longitude: number;
};

export default function Map({ latitude, longitude }: Props) {
  const url = `https://mt0.google.com/vt/scale=${window.devicePixelRatio}&hl=en&x={x}&y={y}&z={z}`;

  return (
    <>
      <h3 className="text-2xl font-bold mt-8 lg:mt-0">Location</h3>
      <div className="mt-4">
        <MapContainer
          center={[latitude, longitude]}
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
        </MapContainer>
      </div>
    </>
  );
}
