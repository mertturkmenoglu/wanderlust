import AppMessage from '@/components/blocks/app-message';
import { ErrorComponent } from '@/components/blocks/error-component';
import OverlayBanner from '@/components/blocks/overlay-banner';
import PoiCard from '@/components/blocks/poi-card';
import TagNavigation from '@/components/blocks/tag-navigation';
import Spinner from '@/components/kit/spinner';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { api } from '@/lib/api';
import { ipx } from '@/lib/ipx';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import CityBreadcrumb from './-city-breadcrumb';
import Map from './-map';

export const Route = createFileRoute('/cities/$/')({
  component: RouteComponent,
  loader: ({ context, params }) => {
    let slug = params._splat;

    if (!slug) {
      throw new Response('Slug is missing', { status: 404 });
    }

    let cityId = slug.split('/')[0];

    if (!cityId) {
      throw new Response('City ID is missing', { status: 404 });
    }

    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/cities/{id}', {
        params: {
          path: {
            id: +cityId,
          },
        },
      }),
    );
  },
  errorComponent: ErrorComponent,
});

function RouteComponent() {
  const city = Route.useLoaderData();

  return (
    <div className="max-w-7xl mx-auto py-8">
      <CityBreadcrumb cityName={city.name} />

      <div className="grid grid-cols-5 gap-8 mt-8">
        <div className="col-span-5 lg:col-span-2">
          <div className="">
            <img
              src={ipx(city.image, 'f_webp,w_1024')}
              alt=""
              className="rounded-md object-cover aspect-video"
            />
          </div>
        </div>

        <div className="col-span-5 lg:col-span-3">
          <h2 className="text-6xl font-bold">{city.name}</h2>
          <div className="mt-2 text-sm text-muted-foreground">
            {city.state.name}/{city.country.name}
          </div>
          <div className="mt-4 text-lg text-muted-foreground">
            {city.description}
          </div>
        </div>
      </div>

      <Map {...city.coordinates} />

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-8">Discover {city.name}</h3>
        <TagNavigation
          urlSuffix={
            '&pois[refinementList][poi.address.city.name][0]=' + city.name
          }
        />
      </div>

      <OverlayBanner
        image="https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Cities Banner Image"
        message={
          <div className="flex items-center gap-4">
            <div>Plan a trip to {city.name}</div>
            <Button
              asChild
              variant="default"
            >
              <Link to="/trips/planner">Start Planning</Link>
            </Button>
          </div>
        }
        className="my-8"
        imgClassName="aspect-[3]"
      />

      <ErrorBoundary
        fallback={<AppMessage errorMessage="Something went wrong" />}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center">
              <Spinner className="size-8 mx-auto my-4" />
            </div>
          }
        >
          <CollectionsContent />
        </Suspense>
      </ErrorBoundary>

      <OverlayBanner
        image={city.image}
        alt={`${city.name} image`}
        message={
          <div className="flex items-center gap-4">
            <div>See all locations in {city.name}</div>
            <Button
              asChild
              variant="default"
            >
              <Link
                to="/search"
                search={{
                  city: city.name,
                }}
              >
                Discover
              </Link>
            </Button>
          </div>
        }
        className="my-8"
        imgClassName="aspect-[3]"
      />
    </div>
  );
}

function CollectionsContent() {
  const { id } = Route.useLoaderData();
  const query = api.useSuspenseQuery('get', '/api/v2/collections/city/{id}', {
    params: {
      path: {
        id,
      },
    },
  });

  return (
    <div className="mt-8 space-y-8">
      {query.data.collections.map((collection) => (
        <div>
          <div
            key={collection.id}
            className="flex items-baseline gap-4 mb-4"
          >
            <h3 className="text-2xl font-bold">{collection.name}</h3>
            <Link
              to="/c/$id"
              params={{
                id: collection.id,
              }}
              className="hover:underline decoration-primary decoration-2 underline-offset-4 text-base text-primary"
            >
              See more
            </Link>
          </div>

          <ScrollArea>
            <div className="flex gap-8 my-4">
              {collection.items.map((item) => (
                <Link
                  key={item.poiId}
                  to="/p/$id"
                  params={{
                    id: item.poiId,
                  }}
                >
                  <PoiCard
                    poi={item.poi}
                    className="w-[256px]"
                    hoverEffects={false}
                  />
                </Link>
              ))}
            </div>
            <ScrollBar
              orientation="horizontal"
              className="mt-8"
            />
          </ScrollArea>
        </div>
      ))}
    </div>
  );
}
