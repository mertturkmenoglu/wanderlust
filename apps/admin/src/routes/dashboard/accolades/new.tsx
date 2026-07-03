import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { getDefaultStaticData } from '@/lib/defaults';
import { accoladesResource as r } from '@/resources/accolades';
import { Upsert } from './-upsert';

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
