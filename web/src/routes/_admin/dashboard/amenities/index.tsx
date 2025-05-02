import AppMessage from '@/components/blocks/app-message';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
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
      <h2 className="text-2xl font-bold tracking-tight">Amenities</h2>
      {amenities.length === 0 && (
        <AppMessage
          emptyMessage="No amenities found"
          showBackButton={false}
          className="mt-8"
        />
      )}
      <div className="grid grid-cols-4 gap-4 mt-8">
        {amenities.map((amenity) => (
          <Link
            to={`/dashboard/amenities/$id`}
            key={amenity.id}
            params={{
              id: `${amenity.id}`,
            }}
          >
            <Button asChild variant="link" className="p-0">
              <div className="font-bold">{amenity.name}</div>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
