import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { getDefaultStaticData } from '@/lib/defaults';
import { categoriesResource as r } from '@/resources/categories';
import { Upsert } from './-upsert';

export const Route = createFileRoute('/dashboard/categories/new')({
	component: RouteComponent,
	staticData: getDefaultStaticData(r, 'new'),
});

function RouteComponent() {
	return (
		<Container title="New Category">
			<Upsert action="create" />
		</Container>
	);
}
