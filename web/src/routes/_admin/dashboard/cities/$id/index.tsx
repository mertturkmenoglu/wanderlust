import BackLink from '@/components/blocks/back-link';
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

      <div className="flex gap-2 mt-2">
        <div className="font-semibold">City Id:</div>
        <div>{city.id}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">City Name:</div>
        <div>{city.name}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">State Code:</div>
        <div>{city.state.code}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">State Name:</div>
        <div>{city.state.name}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">Country Code:</div>
        <div>{city.country.code}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">Country Name:</div>
        <div>{city.country.name}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">Image License:</div>
        <div>{city.image.license ?? '-'}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">Image License Link:</div>
        <div>{city.image.licenseLink ?? '-'}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">Image Attribution:</div>
        <div>{city.image.attribution ?? '-'}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">Image Attribution Link:</div>
        <div>{city.image.attributionLink ?? '-'}</div>
      </div>
    </>
  );
}
