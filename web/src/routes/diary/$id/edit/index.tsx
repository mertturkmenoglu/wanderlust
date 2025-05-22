import BackLink from '@/components/blocks/back-link';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import { FriendsEdit } from './-components/friends-edit';
import { InfoEdit } from './-components/info-edit';
import { LocationsEdit } from './-components/locations-edit';
import { MediaEdit } from './-components/media-edit';

export const Route = createFileRoute('/diary/$id/edit/')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/diary/{id}', {
        params: {
          path: {
            id: params.id,
          },
        },
      }),
    );
  },
});

function RouteComponent() {
  const { entry } = Route.useLoaderData();

  return (
    <div className="max-w-7xl mx-auto my-8">
      <div>
        <BackLink
          href={`/diary/${entry.id}`}
          text="Go back to the diary entry"
        />
        <InfoEdit />

        <Separator className="my-4" />

        <LocationsEdit />
        <FriendsEdit />
        <MediaEdit />
      </div>
    </div>
  );
}
