import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/diary/$id/edit/')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/diary/{id}', {
        params: {
          path: {
            id: params.id,
          },
        },
      }),
    );
  },
});

function RouteComponent() {
  const { entry } = Route.useLoaderData();

  return (
    <div>
      <div>
        <pre>{JSON.stringify(entry, null, 2)}</pre>
      </div>
    </div>
  );
}
