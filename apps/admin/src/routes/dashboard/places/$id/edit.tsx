import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';

export const Route = createFileRoute('/dashboard/places/$id/edit')({
	component: RouteComponent,
	staticData: {
		breadcrumb: 'Edit Place',
	},
});

function RouteComponent() {
	return (
		<Container>
			<div>Work in progress</div>
		</Container>
	);
}
