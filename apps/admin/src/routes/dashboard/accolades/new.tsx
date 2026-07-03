import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { getDefaultStaticData } from '@/lib/defaults';
import { accoladesResource } from '@/resources/accolades';
import { Upsert } from './-upsert';

const r = accoladesResource;

export const Route = createFileRoute('/dashboard/accolades/new')({
	component: RouteComponent,
	staticData: getDefaultStaticData(r, 'new'),
});

function RouteComponent() {
	return (
		<Container title="New Accolade">
			<Upsert action="create" />
		</Container>
	);
}
