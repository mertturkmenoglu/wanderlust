import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import type { components } from '@/lib/api-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.object({
  hours: z.array(
    z.object({
      day: z.string(),
      opensAt: z.string(),
      closesAt: z.string(),
    }),
  ),
});

export const Route = createFileRoute('/_admin/dashboard/pois/$id/edit/hours/')({
  component: RouteComponent,
});

const allDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

function RouteComponent() {
  const route = getRouteApi('/_admin/dashboard/pois/$id/edit');
  const { poi } = route.useLoaderData();
  const invalidator = useInvalidator();
  const entries = Object.entries(poi.openTimes).map(([k, v]) => ({
    day: k,
    ...v,
  }));
  const [everyOpensAt, setEveryOpensAt] = useState('');
  const [everyClosesAt, setEveryClosesAt] = useState('');

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      hours: entries,
    },
  });

  const array = useFieldArray({
    control: form.control,
    name: 'hours',
  });

  const usedDays = form.watch('hours').sort((a, b) => {
    return allDays.indexOf(a.day) - allDays.indexOf(b.day);
  });

  const unusedDays = allDays.filter(
    (day) => !usedDays.some((h) => h.day === day),
  );

  const updateHoursMutation = api.useMutation(
    'patch',
    '/api/v2/pois/{id}/hours',
    {
      onSuccess: async () => {
        await invalidator.invalidate();
        toast.success('Hours updated successfully');
      },
    },
  );

  return (
    <div>
      <h3 className="my-4 text-lg font-medium">
        Edit Point of Interest Open Hours
      </h3>

      <datalist id="open-hours-list">
        <option value="05:00"></option>
        <option value="06:00"></option>
        <option value="07:00"></option>
        <option value="08:00"></option>
        <option value="09:00"></option>
        <option value="10:00"></option>
      </datalist>

      <datalist id="close-hours-list">
        <option value="17:00"></option>
        <option value="18:00"></option>
        <option value="19:00"></option>
        <option value="20:00"></option>
        <option value="21:00"></option>
        <option value="22:00"></option>
      </datalist>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            updateHoursMutation.mutate({
              params: {
                path: {
                  id: poi.id,
                },
              },
              body: {
                hours: data.hours.map(
                  (d) =>
                    ({
                      day: d.day,
                      opensAt: d.opensAt,
                      closesAt: d.closesAt,
                    }) as components['schemas']['UpdatePoiHoursHour'],
                ),
              },
            });
          })}
          className="mt-8"
        >
          <div>
            <div>Days</div>
            <div className="flex gap-2">
              {allDays.map((day) => (
                <button
                  className=""
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (unusedDays.includes(day)) {
                      array.append({
                        day,
                        opensAt: '',
                        closesAt: '',
                      });
                    } else {
                      let indexOf = usedDays.findIndex((h) => h.day === day);
                      if (indexOf !== -1) {
                        array.remove(indexOf);
                      }
                    }
                  }}
                >
                  <Badge
                    key={day}
                    variant={unusedDays.includes(day) ? 'outline' : 'default'}
                  >
                    <div className="capitalize">{day}</div>
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-full">Set for every selected day</div>
            <div>Opens At</div>
            <Input
              type="time"
              className=""
              value={everyOpensAt}
              list="open-hours-list"
              onChange={(e) => {
                for (let i = 0; i < usedDays.length; i++) {
                  form.setValue(`hours.${i}.opensAt`, e.target.value);
                }
                setEveryOpensAt(e.target.value);
              }}
            />

            <div>Closes At</div>
            <Input
              type="time"
              value={everyClosesAt}
              list="close-hours-list"
              onChange={(e) => {
                for (let i = 0; i < usedDays.length; i++) {
                  form.setValue(`hours.${i}.closesAt`, e.target.value);
                }
                setEveryClosesAt(e.target.value);
              }}
            />
          </div>

          <Separator className="my-4" />

          <div>
            {usedDays.map((day, i) => (
              <div
                key={day.day}
                className="grid grid-cols-2 gap-4"
              >
                <div className="capitalize underline col-span-full">
                  {day.day}
                </div>

                <div>Opens At</div>
                <Input
                  type="time"
                  className=""
                  value={day.opensAt}
                  list="open-hours-list"
                  onChange={(e) => {
                    form.setValue(`hours.${i}.opensAt`, e.target.value);
                  }}
                />

                <div>Closes At</div>
                <Input
                  type="time"
                  value={day.closesAt}
                  list="close-hours-list"
                  onChange={(e) => {
                    form.setValue(`hours.${i}.closesAt`, e.target.value);
                  }}
                />
              </div>
            ))}
          </div>

          <div className=" flex justify-end mt-4">
            <Button disabled={false}>Update</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
