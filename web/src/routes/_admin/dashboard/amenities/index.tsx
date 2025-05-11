import AppMessage from '@/components/blocks/app-message';
import BackLink from '@/components/blocks/back-link';
import { keyValueCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/amenities/')({
  component: RouteComponent,
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/amenities/'),
    );
  },
});

function RouteComponent() {
  const { amenities } = Route.useLoaderData();

  return (
    <div>
      <BackLink href="/dashboard" text="Go back to dashboard" />

      <div className="flex items-baseline gap-8 mt-4">
        <h3 className="text-lg font-bold tracking-tight">Amenities</h3>
        <Button asChild variant="link" className="px-0">
          <Link to="/dashboard/amenities/new">New Amenity</Link>
        </Button>
      </div>

      {amenities.length === 0 && (
        <AppMessage
          emptyMessage="No amenities found"
          showBackButton={false}
          className="mt-8"
        />
      )}
      <div className="">
        <DataTable
          columns={keyValueCols}
          filterColumnId="name"
          data={amenities.map((a) => ({
            k: `${a.id}`,
            v: a.name,
          }))}
          hrefPrefix="/dashboard/amenities"
          hrefColumnId="k"
        />
      </div>
    </div>
  );
}
