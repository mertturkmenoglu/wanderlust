'use client';

import { useEffect, useState } from 'react';
import { UseGeoSearchProps } from 'react-instantsearch';
import { MapContainer, TileLayer } from 'react-leaflet';
import Loading from '../loading';
import GeoSearch from './geo-search';

export default function Container(props: UseGeoSearchProps) {
  const [isErr, setIsErr] = useState(false);
  const [pos, setPos] = useState<[number, number]>([0, 0]);
  const [errMsg, setErrMsg] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPos([pos.coords.latitude, pos.coords.longitude]);
        setCompleted(true);
      },
      (err) => {
        setIsErr(true);
        setErrMsg(err.message);
        setCompleted(true);
      },
      {
        timeout: 100_000,
      }
    );
  }, []);

  if (!completed) {
    return <Loading />;
  }

  if (isErr) {
    return <div>{errMsg}</div>;
  }

  return (
    <MapContainer
      center={pos}
      zoom={8}
      minZoom={4}
      scrollWheelZoom={true}
      style={{
        height: '600px',
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoSearch {...props} />
    </MapContainer>
  );
}
