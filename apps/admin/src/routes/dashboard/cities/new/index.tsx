import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { Upsert } from '../-components/upsert';

export const Route = createFileRoute('/dashboard/cities/new/')({
	component: RouteComponent,
	staticData: {
		breadcrumb: 'New City',
	},
});

function RouteComponent() {
	return (
		<Container>
			<Upsert action="create" />
		</Container>
	);
}
