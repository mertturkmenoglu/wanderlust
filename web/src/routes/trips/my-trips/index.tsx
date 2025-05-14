import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';

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
      <pre>{JSON.stringify(trips, null, 2)}</pre>
    </div>
  );
}
