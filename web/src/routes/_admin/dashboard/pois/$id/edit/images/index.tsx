import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { columns } from './-columns';
import { DataTable } from './-data-table';

export const Route = createFileRoute('/_admin/dashboard/pois/$id/edit/images/')(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  const route = getRouteApi('/_admin/dashboard/pois/$id/edit');
  const { poi } = route.useLoaderData();

  return (
    <div>
      <h3 className="my-4 text-lg font-medium">Edit Point of Interest Media</h3>

      <div>
        <DataTable
          columns={columns}
          poi={poi}
          // oxlint-disable-next-line no-map-spread
          data={poi.images.map((img) => ({
            ...img,
            alt: img.alt ?? '',
          }))}
        />
      </div>
    </div>
  );
}
