import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/places/$id/edit/')({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/dashboard/places/$id/edit/"!</div>;
}
