import { ErrorComponent } from '@/components/blocks/error-component';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import { Breadcrumb } from '../-breadcrumb';

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
          { name: 'Detail', href: '/trips' },
          { name: trip.title, href: `/trips/${trip.id}` },
        ]}
      />

      <pre className="mt-8">{JSON.stringify(trip, null, 2)}</pre>
    </div>
  );
}
