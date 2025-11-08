// oxlint-disable no-nested-ternary
import { ActionBanner } from '@/components/blocks/action-banner';
import { OverlayBanner } from '@/components/blocks/overlay-banner';
import { PlacesGrid } from '@/components/blocks/places-grid';
import { QuickActions } from '@/components/blocks/quick-actions';
import { Search } from '@/components/blocks/search';
import { TagNavigation } from '@/components/blocks/tag-navigation';
import { VerticalBanner } from '@/components/blocks/vertical-banner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { AuthContext } from '@/providers/auth-provider';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useContext } from 'react';
import { Image } from '@unpic/react';
import { ipx } from '@/lib/ipx';
import { SuspenseWrapper } from '@/components/blocks/suspense-wrapper';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  const auth = useContext(AuthContext);
  const isAuthenticated = !auth.isLoading && auth.user !== null;

  return (
    <div className="mx-auto max-w-7xl mt-8">
      <Search />

      <TagNavigation />

      {auth.isLoading ? (
        <Skeleton className="w-full h-64 my-8" />
      ) : isAuthenticated ? (
        <QuickActions />
      ) : (
        <OverlayBanner
          image="https://images.unsplash.com/photo-1524168272322-bf73616d9cb5?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Wanderlust Banner Image"
          message="Inspiring explorations, one spark of Wanderlust!"
          className="my-8"
        />
      )}

      <SuspenseWrapper>
        <Content />
      </SuspenseWrapper>
    </div>
  );
}

function Content() {
  const { data: aggregations } = api.useSuspenseQuery(
    'get',
    '/api/v2/aggregator/home',
  );

  const { data: cities } = api.useSuspenseQuery(
    'get',
    '/api/v2/cities/featured',
  );

  return (
    <>
      <div className="flex items-baseline">
        <h2 className="text-2xl font-semibold">Featured Cities</h2>
        <Button
          asChild
          variant="link"
        >
          <Link to="/cities/list">See all</Link>
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {cities.cities.map((city) => (
          <Link
            to="."
            href={`/cities/${city.id}/${city.name}`}
            key={city.id}
            className="rounded-md hover:underline decoration-primary decoration-2 underline-offset-4"
          >
            <Image
              src={ipx(city.image, 'w_512')}
              layout="constrained"
              width={512}
              priority={true}
              aspectRatio={16 / 9}
              className="aspect-video w-full rounded-md object-cover"
            />
            <div className="mt-2 text-base font-bold">{city.name}</div>
          </Link>
        ))}
      </div>

      <OverlayBanner
        image="https://images.unsplash.com/photo-1607388510015-c632e99da586?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Categories Banner Image"
        message={
          <div className="flex items-center gap-4">
            <div>Discover the world around you</div>
            <Button
              asChild
              variant="default"
            >
              <Link to="/categories">See categories</Link>
            </Button>
          </div>
        }
        className="my-8"
        imgClassName="aspect-[3]"
      />

      <PlacesGrid
        dataKey="featured"
        data={aggregations.featured}
      />

      <VerticalBanner
        image="https://i.imgur.com/Y3ujIqE.jpg"
        alt="Discover Around You Banner Image"
        content={
          <div className="text-center">
            <h2 className="mt-8 font-serif text-3xl font-bold text-black/80">
              Discover new locations around you
            </h2>
            <p className="font-serif text-muted-foreground">
              Find new places to explore and enjoy with your friends and family.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="mt-8"
            >
              <Link to="/nearby">Start Exploring</Link>
            </Button>
          </div>
        }
      />

      <PlacesGrid
        dataKey="popular"
        data={aggregations.popular}
      />

      <ActionBanner
        image="https://i.imgur.com/mWzmPRv.jpg"
        alt="Trip Planner Banner Image"
        message={
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-bold text-primary">
              Plan your next trip
            </div>
            <div className="text-sm text-muted-foreground">
              Plan your next trip with our trip planner tool. It&apos;s easy to
              use and you can save your trips for later.
            </div>
            <Button
              asChild
              variant="default"
            >
              <Link
                to="/trips/planner"
                className="text-white"
              >
                Go to Trip Planner
              </Link>
            </Button>
          </div>
        }
        className="my-8"
        imgClassName=""
      />

      <PlacesGrid
        dataKey="favorite"
        data={aggregations.favorites}
      />

      <ActionBanner
        image="https://i.imgur.com/CNtFbZT.jpg"
        alt="Events Banner Image"
        message={
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-bold text-primary">
              Explore Upcoming Events
            </div>
            <div className="text-sm text-muted-foreground">
              Check out the upcoming events in your area. You can also add your
              own events to the list.
            </div>
            <Button
              asChild
              variant="secondary"
            >
              <Link to="/discover/events">See events</Link>
            </Button>
          </div>
        }
        className="my-8"
        imgClassName=""
        lefty={false}
      />

      <PlacesGrid
        dataKey="new"
        data={aggregations.new}
      />
    </>
  );
}
