import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { getDefaultStaticData } from '@/lib/defaults';
import { placesResource as r } from '@/resources/places';

export const Route = createFileRoute('/dashboard/places/new')({
	component: RouteComponent,
	staticData: getDefaultStaticData(r, 'new'),
});

function RouteComponent() {
	return (
		<Container title="New Place">
			<div>Work in progress</div>
		</Container>
	);
}
