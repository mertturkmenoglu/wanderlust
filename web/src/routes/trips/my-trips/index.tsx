import AppMessage from '@/components/blocks/app-message';
import { Breadcrumb } from '@/components/blocks/trips/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import { TripCard } from './-components/card';

export const Route = createFileRoute('/trips/my-trips/')({
  component: RouteComponent,
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/trips/'),
    );
  },
});

function RouteComponent() {
  const { trips } = Route.useLoaderData();

  return (
    <div>
      <Breadcrumb items={[{ name: 'My Trips', href: '/trips/my-trips' }]} />
      <div className="mt-8">
        {trips.map((trip, i) => (
          <div key={trip.id}>
            <TripCard trip={trip} />
            {i !== trips.length - 1 && <Separator className="my-1" />}
          </div>
        ))}
        {trips.length === 0 && (
          <AppMessage
            emptyMessage="You haven't created or joined any trips yet"
            backLink="/trips"
            backLinkText="Go to Trips page"
            className="my-16"
          />
        )}
      </div>
    </div>
  );
}
