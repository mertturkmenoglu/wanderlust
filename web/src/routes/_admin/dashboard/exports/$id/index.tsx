import { DashboardBreadcrumb } from '@/components/blocks/dashboard/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/exports/$id/')({
  component: RouteComponent,
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/export/{id}', {
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
  const { export: exportData } = Route.useLoaderData();
  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Exports', href: '/dashboard/exports' },
          {
            name: exportData.id,
            href: `/dashboard/exports/${exportData.id}`,
          },
        ]}
      />

      <Separator className="my-2" />

      <pre>{JSON.stringify(exportData, null, 2)}</pre>
    </div>
  );
}
