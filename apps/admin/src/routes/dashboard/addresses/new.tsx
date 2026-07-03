import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { getDefaultStaticData } from '@/lib/defaults';
import { addressesResource as r } from '@/resources/addresses';
import { Upsert } from './-upsert';

export const Route = createFileRoute('/dashboard/addresses/new')({
	component: RouteComponent,
	staticData: getDefaultStaticData(r, 'new'),
});

function RouteComponent() {
	return (
		<Container title="New Address">
			<Upsert action="create" />
		</Container>
	);
}
