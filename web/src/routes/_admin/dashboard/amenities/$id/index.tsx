import BackLink from '@/components/blocks/back-link';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { createFileRoute, Link } from '@tanstack/react-router';
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
      <BackLink href="/dashboard/amenities" text="Go back to amenities page" />
      <div className="flex items-end gap-4">
        <h2 className="text-4xl font-bold mt-8">{amenity.name}</h2>
        <Button variant="link" className="px-0" asChild>
          <Link
            to="/dashboard/amenities/$id/edit"
            params={{
              id,
            }}
          >
            Edit
          </Link>
        </Button>
        <DeleteDialog id={amenity.id} />
      </div>
      <div className="flex gap-2 mt-4">
        <div className="font-semibold">ID:</div>
        <div>{amenity.id}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">Name:</div>
        <div>{amenity.name}</div>
      </div>
    </div>
  );
}
