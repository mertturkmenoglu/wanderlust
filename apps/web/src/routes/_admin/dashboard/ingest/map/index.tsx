import { DashboardBreadcrumb } from '@/components/blocks/dashboard/breadcrumb';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { createFileRoute } from '@tanstack/react-router';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { AlertTriangleIcon, DownloadCloudIcon, MapIcon } from 'lucide-react';
import { useEffect } from 'react';
import MapContainer, { useMap } from 'react-map-gl/maplibre';
import { LngLatBounds } from 'maplibre-gl';
import { createStyle } from '@/lib/map';

export const Route = createFileRoute('/_admin/dashboard/ingest/map/')({
  component: RouteComponent,
});

const bbAtom = atom<LngLatBounds>(new LngLatBounds([0, 0], [0, 0]));

function RouteComponent() {
  const bb = useAtomValue(bbAtom);
  const isDisabled = bb.isEmpty();
  // const isDisabled = bb.equals(new LatLngBounds([0, 0], [0, 0]));

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
        initialViewState={{
          longitude: bb.getCenter().lng,
          latitude: bb.getCenter().lat,
          zoom: 0,
        }}
        scrollZoom
        style={{
          height: '600px',
          zIndex: 0,
          width: '100%',
        }}
        mapStyle={createStyle('streets-v2-light')}
      >
        <BoundingBoxWatcher />
      </MapContainer>

      <div className="mt-4">
        <Alert>
          <MapIcon className="size-4" />
          <AlertTitle>Current Bounding Box</AlertTitle>
          <AlertDescription>{bb.toString()}</AlertDescription>
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
                : `https://overpass-api.de/api/map?bbox=${bb.toArray().toString()}`
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
  const { current: map } = useMap();
  const setbb = useSetAtom(bbAtom);

  useEffect(() => {
    // oxlint-disable-next-line func-style
    const onMoveEnd = () => {
      const bounds = map?.getBounds();
      if (bounds) {
        setbb(bounds);
      }
    };

    map?.on('moveend', onMoveEnd);

    // Cleanup on unmount
    return () => {
      map?.off('moveend', onMoveEnd);
    };
  }, [map, setbb]);

  return null;
}
