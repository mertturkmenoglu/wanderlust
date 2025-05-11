import { poisCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/pois/')({
  component: RouteComponent,
});

function RouteComponent() {
  const query = api.useQuery('get', '/api/v2/pois/peek');

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold tracking-tight">
        Point of Interests
      </h3>
      {query.data?.pois && (
        <DataTable
          columns={poisCols}
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
