import AppMessage from '@/components/blocks/app-message';
import CollapsibleText from '@/components/blocks/collapsible-text';
import PoiCard from '@/components/blocks/poi-card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import { createFileRoute, getRouteApi, Link } from '@tanstack/react-router';
import {
  addDays,
  eachDayOfInterval,
  formatDate,
  isWithinInterval,
} from 'date-fns';
import { AddLocationDialog } from './-add-location-dialog';
import { InfoCard } from './-info-card';

export const Route = createFileRoute('/trips/$id/')({
  component: RouteComponent,
});

function RouteComponent() {
  const route = getRouteApi('/trips/$id');
  const { trip } = route.useLoaderData();
  const { auth } = route.useRouteContext();
  const isPrivileged = useTripIsPrivileged(trip, auth.user?.id ?? '');

  const intervalDays = eachDayOfInterval({
    start: trip.startAt,
    end: trip.endAt,
  });

  const days = intervalDays.map((day) => {
    return {
      day,
      locations: trip.locations.filter((loc) =>
        isWithinInterval(new Date(loc.scheduledTime), {
          start: day,
          end: addDays(day, 1),
        }),
      ),
    };
  });

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
        <InfoCard type="participants" count={trip.participants.length + 1} />

        <InfoCard type="days" count={intervalDays.length} />

        <InfoCard type="locations" count={trip.locations.length} />
      </div>

      <div className="">
        <div className="my-4">
          {isPrivileged && <AddLocationDialog tripId={trip.id} />}
        </div>

        <Accordion
          type="multiple"
          defaultValue={days.map((_, i) => `day-${i}`)}
        >
          {days.map(({ day, locations }, i) => (
            <AccordionItem value={`day-${i}`} key={`day-${i}`} className="mt-2">
              <AccordionTrigger className="flex items-center w-full">
                <div className="text-lg font-semibold">Day {i + 1}</div>

                <div className="text-sm text-muted-foreground ml-auto">
                  {formatDate(day, 'dd MMM')}
                </div>
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {locations.length === 0 && (
                  <AppMessage
                    emptyMessage="No locations scheduled for this day"
                    imageClassName="size-16"
                    showBackButton={false}
                    className="my-4 col-span-full"
                  />
                )}

                {locations.map((loc) => (
                  <div key={loc.scheduledTime}>
                    <Link
                      to="/p/$id"
                      params={{
                        id: loc.poi.id,
                      }}
                    >
                      <PoiCard
                        poi={{
                          ...loc.poi,
                          image: {
                            url: loc.poi.media[0]?.url ?? '',
                            alt: loc.poi.media[0]?.alt ?? '',
                          },
                        }}
                      />
                    </Link>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
