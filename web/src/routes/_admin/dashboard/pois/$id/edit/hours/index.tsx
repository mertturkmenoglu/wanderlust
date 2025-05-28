import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
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

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

function RouteComponent() {
  const route = getRouteApi('/_admin/dashboard/pois/$id/edit');
  const { poi } = route.useLoaderData();
  const entries = Object.entries(poi.openTimes).map(([k, v]) => ({
    day: k,
    ...v,
  }));

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      hours: entries,
    },
  });

  const hours = form.watch('hours').sort((a, b) => {
    return days.indexOf(a.day) - days.indexOf(b.day);
  });

  return (
    <div>
      <h3 className="my-4 text-lg font-medium">
        Edit Point of Interest Open Hours
      </h3>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            console.log(data);
          })}
          className="mt-8 grid grid-cols-1 gap-8 px-0 max-w-md"
        >
          {hours.map((day, i) => (
            <div
              key={day.day}
              className="col-span-full"
            >
              <div className="capitalize underline">{day.day}</div>
              <div className="mt-2 flex items-center gap-8">
                <div>Opens At</div>
                <Input
                  type="time"
                  value={day.opensAt}
                  onChange={(e) => {
                    form.setValue(`hours.${i}.opensAt`, e.target.value);
                  }}
                />
              </div>

              <div className="flex items-center gap-8">
                <div>Closes At</div>
                <Input
                  type="time"
                  value={day.closesAt}
                  onChange={(e) => {
                    form.setValue(`hours.${i}.closesAt`, e.target.value);
                  }}
                />
              </div>
            </div>
          ))}
        </form>
      </Form>
    </div>
  );
}
