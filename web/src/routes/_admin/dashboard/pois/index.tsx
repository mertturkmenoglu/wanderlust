import { DashboardBreadcrumb } from '@/components/blocks/dashboard/breadcrumb';
import { poisCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/pois/')({
  component: RouteComponent,
});

function RouteComponent() {
  const query = api.useQuery('get', '/api/v2/pois/peek');

  return (
    <div>
      <DashboardBreadcrumb
        items={[{ name: 'Point of Interests', href: '/dashboard/pois' }]}
      />
      <Separator className="my-2" />

      {query.data?.pois && (
        <DataTable
          columns={poisCols}
          filterColumnId="name"
          data={query.data.pois.map((poi) => ({
            id: poi.id,
            name: poi.name,
            addressId: poi.addressId,
            categoryId: poi.categoryId,
          }))}
          hrefPrefix="/dashboard/pois"
        />
      )}
    </div>
  );
}
