import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { getDefaultStaticData } from '@/lib/defaults';
import { collectionsResource as r } from '@/resources/collections';
import { Upsert } from './-upsert';

export const Route = createFileRoute('/dashboard/collections/new')({
	component: RouteComponent,
	staticData: getDefaultStaticData(r, 'new'),
});

function RouteComponent() {
	return (
		<Container title="New Collection">
			<Upsert action="create" />
		</Container>
	);
}
