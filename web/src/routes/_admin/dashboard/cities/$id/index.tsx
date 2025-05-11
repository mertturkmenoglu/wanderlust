import BackLink from '@/components/blocks/back-link';
import {
  keyValueCols,
  type KeyValueCols,
} from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { ipx } from '@/lib/ipx';
import { createFileRoute, Link } from '@tanstack/react-router';
import DeleteDialog from '../../-delete-dialog';
import { useDeleteCityMutation } from './-hooks';

export const Route = createFileRoute('/_admin/dashboard/cities/$id/')({
  component: RouteComponent,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/cities/{id}', {
        params: {
          path: {
            id: +params.id,
          },
        },
      }),
    ),
});

function RouteComponent() {
  const city = Route.useLoaderData();
  const mutation = useDeleteCityMutation();

  return (
    <>
      <BackLink href="/dashboard/cities" text="Go back to cities page" />

      <img
        src={ipx(city.image.url, 'w_512')}
        alt={city.name}
        className="mt-4 w-64 rounded-md aspect-video object-cover"
      />

      <h2 className="text-4xl font-bold mt-4">{city.name}</h2>

      <div className="flex flex-row gap-2 w-min items-start mt-4">
        <Button variant="outline" asChild>
          <Link to="." href={`/cities/${city.id}/${city.name}`}>
            Visit Page
          </Link>
        </Button>

        <Button variant="outline" asChild>
          <Link
            to="/dashboard/cities/$id/edit"
            params={{
              id: `${city.id}`,
            }}
          >
            Edit
          </Link>
        </Button>

        <DeleteDialog
          type="city"
          onClick={() =>
            mutation.mutate({
              params: {
                path: {
                  id: city.id,
                },
              },
            })
          }
        />
      </div>

      <Separator className="my-4 max-w-md" />

      <h3 className="mt-4 text-lg font-bold tracking-tight">Short Info</h3>

      <DataTable
        columns={keyValueCols}
        filterColumnId="key"
        data={
          [
            {
              k: 'ID',
              v: city.id,
            },
            {
              k: 'Name',
              v: city.name,
            },
            {
              k: 'State Code',
              v: city.state.code,
            },
            {
              k: 'State Name',
              v: city.state.name,
            },
            {
              k: 'Country Code',
              v: city.country.code,
            },
            {
              k: 'Country Name',
              v: city.country.name,
            },
            {
              k: 'Image License',
              v: city.image.license ?? '-',
            },
            {
              k: 'Image License Link',
              v: city.image.licenseLink ?? '-',
            },
            {
              k: 'Image Attribution',
              v: city.image.attribution ?? '-',
            },
            {
              k: 'Image Attribution Link',
              v: city.image.attributionLink ?? '-',
            },
          ] as KeyValueCols[]
        }
      />
    </>
  );
}
