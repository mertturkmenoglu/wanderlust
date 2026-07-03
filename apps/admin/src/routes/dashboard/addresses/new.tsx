import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { getDefaultStaticData } from '@/lib/defaults';
import { addressesResource } from '@/resources/addresses';
import { Upsert } from './-upsert';

const r = addressesResource;

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
