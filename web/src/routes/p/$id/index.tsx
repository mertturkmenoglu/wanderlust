import CollapsibleText from '@/components/blocks/collapsible-text';
import { ErrorComponent } from '@/components/blocks/error-component';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { createFileRoute } from '@tanstack/react-router';
import { MapIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import Lightbox, { type ThumbnailsRef } from 'yet-another-react-lightbox';
import Inline from 'yet-another-react-lightbox/plugins/inline';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Amenities from './-components/amenities';
import BookmarkButton from './-components/bookmark-button';
import Breadcrumb from './-components/breadcrumb';
import FavoriteButton from './-components/favorite-button';
import InformationTable from './-components/info-table';
import MapContainer from './-components/map-container';
import Menu from './-components/menu';
import NearbyPois from './-components/nearby-pois';
import Reviews from './-components/reviews';

export const Route = createFileRoute('/p/$id/')({
  component: RouteComponent,
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/pois/{id}', {
        params: {
          path: {
            id: params.id,
          },
        },
      }),
    );
  },
  errorComponent: ErrorComponent,
});

function RouteComponent() {
  const { poi } = Route.useLoaderData();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const ref = useRef<ThumbnailsRef>(null);

  const toggleOpen = (state: boolean) => () => setOpen(state);

  const updateIndex = ({ index: current }: { index: number }) =>
    setIndex(current);

  return (
    <main className="max-w-7xl mx-auto mt-8 md:mt-16">
      <Breadcrumb />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="h-min">
          <Lightbox
            index={index}
            slides={poi.media.map((m) => ({
              src: m.url,
            }))}
            className=""
            plugins={[Inline, Thumbnails]}
            thumbnails={{
              ref: ref,
              vignette: false,
              imageFit: 'cover',
              border: 0,
              borderColor: '#FFF',
            }}
            on={{
              view: updateIndex,
              click: toggleOpen(true),
            }}
            carousel={{
              padding: 0,
              spacing: 0,
              imageFit: 'cover',
            }}
            styles={{
              container: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
              thumbnailsContainer: {
                backgroundColor: 'rgba(0, 0, 0, 0.0)',
              },
              thumbnail: {
                backgroundColor: 'rgba(0, 0, 0, 0.0)',
              },
            }}
            inline={{
              style: {
                aspectRatio: '1/1',
                margin: '0 auto',
              },
            }}
          />

          <Lightbox
            open={open}
            close={toggleOpen(false)}
            index={index}
            slides={poi.media.map((m) => ({
              src: m.url,
            }))}
            on={{ view: updateIndex }}
            animation={{ fade: 0 }}
            controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
            styles={{
              container: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
            }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="line-clamp-2 scroll-m-20 text-4xl capitalize tracking-tight">
              {poi.name}
            </h2>

            <div className="flex items-center">
              <FavoriteButton />

              <BookmarkButton />

              <Menu />
            </div>
          </div>

          <p className="mt-2 text-sm text-primary">{poi.category.name}</p>

          <h2 className="mt-4 text-lg font-bold">Information</h2>
          <InformationTable />

          <button
            className={cn(
              'bg-primary text-white rounded-md w-full lg:w-2/3 lg:mx-auto',
              'px-8 py-2.5 mt-4 flex items-center gap-2 justify-center hover:opacity-90',
              'transition-all duration-200 ease-in-out',
            )}
          >
            <MapIcon className="size-5" />
            <span className="text-base">Plan a trip</span>
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold">Description</h3>
        <CollapsibleText
          text={poi.description}
          charLimit={1000}
        />
      </div>

      <Separator className="my-4" />

      <div className="w-full">
        <MapContainer />
      </div>

      <Separator className="my-4" />

      <Amenities />

      <Separator className="my-4" />

      <NearbyPois />

      <Separator className="my-4" />

      <Reviews />
    </main>
  );
}
