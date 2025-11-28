import { AppMessage } from '@/components/blocks/app-message';
import { CollapsibleText } from '@/components/blocks/collapsible-text';
import { PlaceCard } from '@/components/blocks/place-card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import { cn } from '@/lib/utils';
import {
  createFileRoute,
  getRouteApi,
  Link,
  useNavigate,
} from '@tanstack/react-router';
import {
  addDays,
  eachDayOfInterval,
  formatDate,
  isWithinInterval,
} from 'date-fns';
import { useMemo } from 'react';
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
  const navigate = useNavigate();

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

  const defaultOpenDays = useMemo(() => {
    const indices: number[] = [];

    for (let i = 0; i < days.length; i += 1) {
      // oxlint-disable-next-line no-non-null-assertion
      if (days[i]!.locations.length > 0) {
        indices.push(i);
      }
    }

    return indices.map((i) => `day-${i}`);
  }, [days]);

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
        <div className="my-4">{isPrivileged && <UpsertLocationDialog />}</div>

        <Accordion
          type="multiple"
          defaultValue={defaultOpenDays}
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
                        <div className="min-w-8 w-8 h-1 bg-border" />
                        <div className="text-lg text-muted-foreground">
                          {formatDate(loc.scheduledTime, 'HH:mm')}
                        </div>
                      </div>
                      <div>
                        <Link
                          to="/p/$id"
                          params={{
                            id: loc.placeId,
                          }}
                        >
                          <PlaceCard
                            className="max-w-xs"
                            hoverEffects={false}
                            place={loc.place}
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
                            onOpen={() => {
                              navigate({
                                to: '.',
                                search: () => ({
                                  showLocationDialog: true,
                                  isUpdate: true,
                                  placeId: loc.placeId,
                                  description: loc.description,
                                  scheduledTime: loc.scheduledTime,
                                  locId: loc.id,
                                }),
                              });
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
