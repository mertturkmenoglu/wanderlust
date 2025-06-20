import { DashboardBreadcrumb } from '@/components/blocks/dashboard/breadcrumb';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { tileUrl } from '@/lib/map';
import { createFileRoute } from '@tanstack/react-router';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { LatLngBounds } from 'leaflet';
import { AlertTriangleIcon, DownloadCloudIcon, MapIcon } from 'lucide-react';
import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';

export const Route = createFileRoute('/_admin/dashboard/ingest/map/')({
  component: RouteComponent,
});

const bbAtom = atom<LatLngBounds>(new LatLngBounds([0, 0], [0, 0]));

function RouteComponent() {
  const bb = useAtomValue(bbAtom);
  const isDisabled = bb.equals(new LatLngBounds([0, 0], [0, 0]));

  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Ingest', href: '/dashboard/ingest' },
          { name: 'Bounding Box', href: '/dashboard/ingest/map' },
        ]}
      />

      <Separator className="my-2" />

      <MapContainer
        center={[51.523_771_418_279_33, -0.158_553_196_119_818_36]}
        zoom={18}
        scrollWheelZoom
        style={{
          height: '600px',
          zIndex: 0,
          width: '100%',
        }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url={tileUrl}
        />
        <BoundingBoxWatcher />
      </MapContainer>

      <div className="mt-4">
        <Alert>
          <MapIcon className="size-4" />
          <AlertTitle>Current Bounding Box</AlertTitle>
          <AlertDescription>{bb.toBBoxString()}</AlertDescription>
        </Alert>

        <Alert className="mt-4">
          <AlertTriangleIcon className="size-4" />
          <AlertTitle>Reminder</AlertTitle>
          <AlertDescription>
            <ul>
              <li>Select a bounding box</li>
              <li>Data size is proportional to the area of the bounding box</li>
              <li>Respect API usage limits</li>
              <li>After you download the data, rename it to .xml</li>
              <li>Move the file to API project tmp folder</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>

      <div className="mt-4">
        <Button
          variant="default"
          className="w-full"
          {...(isDisabled && { disabled: true })}
        >
          <a
            href={
              isDisabled
                ? '#'
                : `https://overpass-api.de/api/map?bbox=${bb.toBBoxString()}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <DownloadCloudIcon className="size-4" />
            Download from Overpass API
          </a>
        </Button>
      </div>
    </div>
  );
}

function BoundingBoxWatcher() {
  const map = useMap();
  const setbb = useSetAtom(bbAtom);

  useEffect(() => {
    // oxlint-disable-next-line func-style
    const onMoveEnd = () => {
      const bounds = map.getBounds();
      setbb(bounds);
    };

    map.on('moveend', onMoveEnd);

    // Cleanup on unmount
    return () => {
      map.off('moveend', onMoveEnd);
    };
  }, [map, setbb]);

  return null;
}
