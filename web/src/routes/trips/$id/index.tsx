import CollapsibleText from '@/components/blocks/collapsible-text';
import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { differenceInDays } from 'date-fns';
import { InfoCard } from './-info-card';

export const Route = createFileRoute('/trips/$id/')({
  component: RouteComponent,
});

function RouteComponent() {
  const route = getRouteApi('/trips/$id');
  const { trip } = route.useLoaderData();

  return (
    <div className="mt-4">
      <div>
        <div className="text-lg underline">Description</div>
        <CollapsibleText
          text={
            trip.description.length > 0 ? trip.description : 'No description.'
          }
          className="mt-2"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-4">
        <InfoCard type="participants" count={trip.participants.length} />

        <InfoCard
          type="days"
          count={differenceInDays(trip.endAt, trip.startAt)}
        />

        <InfoCard type="locations" count={trip.locations.length} />
      </div>
    </div>
  );
}
