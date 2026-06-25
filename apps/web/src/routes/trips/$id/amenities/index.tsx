import { createFileRoute } from '@tanstack/react-router';
import { Content } from './-components/content';
import { TripAmenitiesContextProvider } from './-components/context';

export const Route = createFileRoute('/trips/$id/amenities/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<TripAmenitiesContextProvider>
			<Content />
		</TripAmenitiesContextProvider>
	);
}
