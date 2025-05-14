import { ErrorComponent } from '@/components/blocks/error-component';
import { api } from '@/lib/api';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/trips/$id/')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({
        to: '/sign-in',
      });
    }
  },
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
      <pre>{JSON.stringify(trip, null, 2)}</pre>
    </div>
  );
}
