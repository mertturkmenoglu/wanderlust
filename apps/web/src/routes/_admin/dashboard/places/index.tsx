import { DashboardBreadcrumb } from '@/components/blocks/dashboard/breadcrumb';
import { placesCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/places/')({
  component: RouteComponent,
});

function RouteComponent() {
  const query = api.useQuery('get', '/api/v2/places/peek');

  return (
    <div>
      <DashboardBreadcrumb
        items={[{ name: 'Places', href: '/dashboard/places' }]}
      />
      <Separator className="my-2" />

      {query.data?.places && (
        <DataTable
          columns={placesCols}
          filterColumnId="name"
          data={query.data.places.map((place) => ({
            id: place.id,
            name: place.name,
            addressId: place.addressId,
            categoryId: place.categoryId,
          }))}
          hrefPrefix="/dashboard/places"
        />
      )}
    </div>
  );
}
