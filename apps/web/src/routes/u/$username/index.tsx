import { createFileRoute } from '@tanstack/react-router';
import { ErrorComponent } from '@/components/error-component';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { authGuard } from '@/lib/auth';
import { orpc } from '@/lib/orpc';
import { InfoCardGroup } from './-components/info-card-group';
import { TopPlaces } from './-components/top-places';

export const Route = createFileRoute('/u/$username/')({
	component: RouteComponent,
	beforeLoad: authGuard,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			orpc.users.get.queryOptions({
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
			<div>
				<div className="text-2xl">About</div>

				<InfoCardGroup className="mt-4" />
			</div>

			<SuspenseWrapper>
				<TopPlaces className="mt-8" />
			</SuspenseWrapper>
		</div>
	);
}
