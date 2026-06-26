import { createFileRoute } from '@tanstack/react-router';
import { Content } from './-components/content';
import { TripCreateInviteContextProvider } from './-components/context';
import { Header } from './-components/header';

export const Route = createFileRoute('/trips/$id/participants/invites/new/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<Header />

			<TripCreateInviteContextProvider>
				<Content />
			</TripCreateInviteContextProvider>
		</div>
	);
}
