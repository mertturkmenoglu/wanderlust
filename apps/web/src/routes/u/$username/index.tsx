import { ErrorComponent } from '@/components/blocks/error-component';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import { FavoriteLocations } from './-components/favorite-locations';
import { InfoCardGroup } from './-components/info-card-group';

export const Route = createFileRoute('/u/$username/')({
  component: RouteComponent,
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/users/{username}/top', {
        params: {
          path: {
            username: params.username,
          },
        },
      }),
    );
  },
  errorComponent: ErrorComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="text-2xl font-medium">About</div>

          <InfoCardGroup className="mt-4" />
        </div>

        <div>
          <FavoriteLocations />
        </div>
      </div>
    </div>
  );
}
