import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { Upsert } from './-upsert';

export const Route = createFileRoute('/dashboard/addresses/new')({
	component: RouteComponent,
	staticData: {
		breadcrumb: 'New Address',
	},
});

function RouteComponent() {
	return (
		<Container>
			<Upsert action="create" />
		</Container>
	);
}
