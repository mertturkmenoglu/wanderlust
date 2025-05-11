import DashboardBreadcrumb from '@/components/blocks/dashboard/breadcrumb';
import { Separator } from '@/components/ui/separator';
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
      <DashboardBreadcrumb
        items={[
          { name: 'Point of Interests', href: '/dashboard/pois' },
          {
            name: poi.name,
            href: `/dashboard/pois/${poi.id}`,
          },
          {
            name: 'Edit',
            href: `/dashboard/pois/${poi.id}/edit`,
          },
        ]}
      />

      <Separator className="my-2" />

      <div>This is the edit page for point of interest {poi.id}</div>
      <div>
        <pre className="max-w-xl break-words flex-wrap text-wrap whitespace-pre-wrap">
          {JSON.stringify(poi, null, 2)}
        </pre>
      </div>
    </div>
  );
}
