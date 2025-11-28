import { createFileRoute } from '@tanstack/react-router';
import { ErrorComponent } from '@/components/blocks/error-component';
import { api } from '@/lib/api';
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
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
				<div>
					<div className="font-medium text-2xl">About</div>

					<InfoCardGroup className="mt-4" />
				</div>

				<div>
					<FavoriteLocations />
				</div>
			</div>
		</div>
	);
}
