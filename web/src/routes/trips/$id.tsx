import { ErrorComponent } from '@/components/blocks/error-component';
import { Breadcrumb } from '@/components/blocks/trips/breadcrumb';
import { TripInfo } from '@/components/blocks/trips/trip-info';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/trips/$id')({
  component: RouteComponent,
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/trips/{id}', {
        params: {
          path: {
            id: params.id,
          },
        },
      }),
    );
  },
  errorComponent: ErrorComponent,
});

function RouteComponent() {
  const { trip } = Route.useLoaderData();

  return (
    <div>
      <Breadcrumb
        items={[
          { name: 'Detail', href: '/trips/my-trips' },
          { name: trip.title, href: `/trips/${trip.id}` },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-8 my-8">
        <TripInfo className="w-full col-span-full md:col-span-1 md:border-r border-border" />

        <div className="w-full col-span-full md:col-span-3">
          <div className="">
            <div className="text-2xl">{trip.title}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Created by: {trip.owner.fullName}
            </div>

            <Separator className="my-2" />

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
