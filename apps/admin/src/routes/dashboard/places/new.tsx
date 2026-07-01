import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';

export const Route = createFileRoute('/dashboard/places/new')({
	component: RouteComponent,
	staticData: {
		breadcrumb: 'New Place',
	},
});

function RouteComponent() {
	return (
		<Container>
			<div>Work in progress</div>
		</Container>
	);
}
