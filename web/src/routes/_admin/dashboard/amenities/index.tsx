import { DashboardActions } from '@/components/blocks/dashboard/actions';
import { DashboardBreadcrumb } from '@/components/blocks/dashboard/breadcrumb';
import { keyValueCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
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
      <DashboardBreadcrumb
        items={[{ name: 'Amenities', href: '/dashboard/amenities' }]}
      />
      <Separator className="my-2" />

      <DashboardActions>
        <Link
          to="/dashboard/amenities/new"
          className={cn(buttonVariants({ variant: 'link' }), 'px-0')}
        >
          New Amenity
        </Link>
      </DashboardActions>

      <div className="">
        <DataTable
          columns={keyValueCols}
          filterColumnId="v"
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
