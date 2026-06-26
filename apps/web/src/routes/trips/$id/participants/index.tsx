import { createFileRoute } from '@tanstack/react-router';
import { Content } from './-components/content';
import { TripParticipantsContextProvider } from './-components/context';

export const Route = createFileRoute('/trips/$id/participants/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<TripParticipantsContextProvider>
			<Content />
		</TripParticipantsContextProvider>
	);
}
