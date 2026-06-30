import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';

export const Route = createFileRoute('/dashboard/places/new/')({
	component: RouteComponent,
});

function RouteComponent() {
	return <Container>Work in progress</Container>;
}
