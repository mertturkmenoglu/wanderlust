import BackLink from '@/components/blocks/back-link';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/pois/$id/edit/')({
  component: RouteComponent,
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/pois/{id}', {
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
  const { poi } = Route.useLoaderData();

  return (
    <div>
      <BackLink
        href={`/dashboard/pois/${poi.id}`}
        text="Go back to point of interest details"
      />
      <div>This is the edit page for point of interest {poi.id}</div>
      <div>
        <pre className="max-w-xl break-words flex-wrap text-wrap whitespace-pre-wrap">
          {JSON.stringify(poi, null, 2)}
        </pre>
      </div>
    </div>
  );
}
