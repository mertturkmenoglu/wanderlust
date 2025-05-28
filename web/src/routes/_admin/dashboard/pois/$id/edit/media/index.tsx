import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { columns } from './-columns';
import { DataTable } from './-data-table';

export const Route = createFileRoute('/_admin/dashboard/pois/$id/edit/media/')({
  component: RouteComponent,
});

function RouteComponent() {
  const route = getRouteApi('/_admin/dashboard/pois/$id/edit');
  const { poi } = route.useLoaderData();
  const media = poi.media;

  return (
    <div>
      <h3 className="my-4 text-lg font-medium">Edit Point of Interest Media</h3>

      <div>
        <DataTable
          columns={columns}
          poi={poi}
          data={media.map((m) => ({
            ...m,
            fileName: '',
            caption: m.caption ?? '',
          }))}
        />
      </div>
    </div>
  );
}
