import { ErrorComponent } from '@/components/blocks/error-component';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import { Breadcrumb } from '../-breadcrumb';
import { DetailColumn } from './-components/details';
import { UserColumn } from './-components/user';

export const Route = createFileRoute('/trips/$id/')({
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
        <UserColumn className="w-full col-span-full md:col-span-1 md:border-r border-border" />

        <DetailColumn className="w-full col-span-full md:col-span-3" />
      </div>
    </div>
  );
}
