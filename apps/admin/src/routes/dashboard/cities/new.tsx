import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { getDefaultStaticData } from '@/lib/defaults';
import { citiesResource as r } from '@/resources/cities';
import { Upsert } from './-upsert';

export const Route = createFileRoute('/dashboard/cities/new')({
	component: RouteComponent,
	staticData: getDefaultStaticData(r, 'new'),
});

function RouteComponent() {
	return (
		<Container title="New City">
			<Upsert action="create" />
		</Container>
	);
}
