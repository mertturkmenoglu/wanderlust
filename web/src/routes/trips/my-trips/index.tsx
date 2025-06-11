import { AppMessage } from '@/components/blocks/app-message';
import { Breadcrumb } from '@/components/blocks/trips/breadcrumb';
import { Spinner } from '@/components/kit/spinner';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import { TripCard } from './-components/card';

export const Route = createFileRoute('/trips/my-trips/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Breadcrumb items={[{ name: 'My Trips', href: '/trips/my-trips' }]} />
      <Content />
    </div>
  );
}

function Content() {
  const query = api.useInfiniteQuery(
    'get',
    '/api/v2/trips/',
    {
      params: {
        query: {
          pageSize: 10,
        },
      },
    },
    {
      initialPageParam: 1,
      pageParamName: 'page',
      getNextPageParam: (lastPage: {
        pagination: { hasNext: boolean; page: number };
      }) =>
        lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    },
  );

  if (query.isPending) {
    return (
      <div>
        <Spinner className="mx-auto my-32 size-12" />
      </div>
    );
  }

  if (query.error) {
    return (
      <AppMessage
        errorMessage={query.error.title ?? 'Something went wrong'}
        backLink="/trips"
        backLinkText="Go to Trips page"
        className="my-16"
      />
    );
  }

  const trips = query.data.pages.flatMap((page) => page.trips);

  if (trips.length === 0) {
    return (
      <AppMessage
        emptyMessage="You haven't created or joined any trips yet"
        backLink="/trips"
        backLinkText="Go to Trips page"
        className="my-16"
      />
    );
  }

  return (
    <div className="mt-8">
      {trips.map((trip, i) => (
        <div key={trip.id}>
          <TripCard trip={trip} />
          {i !== trips.length - 1 && <Separator className="my-1" />}
        </div>
      ))}
    </div>
  );
}
