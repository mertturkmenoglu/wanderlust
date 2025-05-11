import { keyValueCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router';
import DashboardActions from '../../-dashboard-actions';
import DashboardBreadcrumb from '../../-dashboard-breadcrumb';
import DeleteDialog from './-delete-dialog';

export const Route = createFileRoute('/_admin/dashboard/amenities/$id/')({
  component: RouteComponent,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/amenities/'),
    ),
});

function RouteComponent() {
  const { amenities } = Route.useLoaderData();
  const { id } = Route.useParams();
  const amenity = amenities.find((amenity) => amenity.id === +id);

  if (!amenity) {
    throw new Response('Amenity not found', { status: 404 });
  }

  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Amenities', href: '/dashboard/amenities' },
          {
            name: amenity.name,
            href: `/dashboard/amenities/${amenity.id}`,
          },
        ]}
      />
      <Separator className="my-2" />

      <DashboardActions>
        <div className="flex items-center gap-2 mt-4">
          <Link
            to="/dashboard/amenities/$id/edit"
            params={{
              id,
            }}
            className={cn(
              buttonVariants({ variant: 'default', size: 'sm' }),
              '',
            )}
          >
            Edit
          </Link>

          <DeleteDialog id={amenity.id} />
        </div>
      </DashboardActions>

      <DataTable
        columns={keyValueCols}
        filterColumnId="k"
        data={[
          {
            k: 'ID',
            v: `${amenity.id}`,
          },
          {
            k: 'Name',
            v: amenity.name,
          },
        ]}
      />
    </div>
  );
}
