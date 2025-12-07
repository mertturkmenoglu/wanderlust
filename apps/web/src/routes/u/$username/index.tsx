import { createFileRoute } from '@tanstack/react-router';
import { ErrorComponent } from '@/components/error-component';
import { authGuard } from '@/lib/auth';
import { FavoriteLocations } from './-components/favorite-locations';
import { InfoCardGroup } from './-components/info-card-group';

export const Route = createFileRoute('/u/$username/')({
	component: RouteComponent,
	beforeLoad: authGuard,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			context.orpc.users.get.queryOptions({
				input: {
					username: params.username,
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
