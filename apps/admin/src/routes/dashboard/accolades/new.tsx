import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/accolades/new')({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/dashboard/accolades/new"!</div>;
}
