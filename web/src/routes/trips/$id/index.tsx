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
import { cn } from '@/lib/utils';
import { createFileRoute, getRouteApi, Link } from '@tanstack/react-router';
import {
  addDays,
  eachDayOfInterval,
  formatDate,
  isWithinInterval,
} from 'date-fns';
import { InfoCard } from './-info-card';
import { UpsertLocationDialog } from './-upsert-location-dialog';

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
        <InfoCard
          type="participants"
          count={trip.participants.length + 1}
        />

        <InfoCard
          type="days"
          count={intervalDays.length}
        />

        <InfoCard
          type="locations"
          count={trip.locations.length}
        />
      </div>

      <div className="">
        <div className="my-4">
          {isPrivileged && <UpsertLocationDialog tripId={trip.id} />}
        </div>

        <Accordion
          type="multiple"
          defaultValue={days
            .filter((d) => d.locations.length > 0)
            .map((_, i) => `day-${i}`)}
        >
          {days.map(({ day, locations }, i) => (
            <AccordionItem
              value={`day-${i}`}
              key={`day-${i}`}
              className="mt-2 border-none"
            >
              <AccordionTrigger className="flex items-center w-full">
                <div className="text-lg font-semibold">Day {i + 1}</div>

                <div className="text-sm text-muted-foreground ml-auto">
                  {formatDate(day, 'dd MMM')}
                </div>
              </AccordionTrigger>
              <AccordionContent
                className={cn('grid grid-cols-1 gap-16 my-4', {
                  'border-l-4 border-border gap-16': locations.length > 0,
                })}
              >
                {locations.length === 0 && (
                  <AppMessage
                    emptyMessage="No locations scheduled for this day"
                    imageClassName="size-16"
                    showBackButton={false}
                    className="my-4 col-span-full"
                  />
                )}

                {locations
                  .sort(
                    (a, b) =>
                      new Date(a.scheduledTime).getTime() -
                      new Date(b.scheduledTime).getTime(),
                  )
                  .map((loc) => (
                    <div
                      key={loc.scheduledTime}
                      className="flex items-center gap-4 ml-2"
                    >
                      <div className="flex items-center self-start gap-2 mt-20">
                        <div className="min-w-8 w-8 h-1 bg-border"></div>
                        <div className="text-lg text-muted-foreground">
                          {formatDate(loc.scheduledTime, 'HH:mm')}
                        </div>
                      </div>
                      <div>
                        <Link
                          to="/p/$id"
                          params={{
                            id: loc.poi.id,
                          }}
                        >
                          <PoiCard
                            className="max-w-xs"
                            poi={loc.poi}
                          />
                        </Link>
                        <div className="mt-4">
                          <div className="text-sm text-muted-foreground">
                            {loc.description}
                          </div>
                        </div>
                      </div>
                      {isPrivileged && (
                        <div className="ml-auto self-start">
                          <UpsertLocationDialog
                            tripId={trip.id}
                            initial={{
                              desc: loc.description,
                              locationId: loc.id,
                              item: {
                                categoryName: loc.poi.category.name,
                                id: loc.poi.id,
                                image: loc.poi.media[0]?.url ?? '',
                                name: loc.poi.name,
                                city: loc.poi.address.city.name,
                                state: loc.poi.address.city.state.name,
                              },
                              time: loc.scheduledTime,
                            }}
                          />
                        </div>
                      )}
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
