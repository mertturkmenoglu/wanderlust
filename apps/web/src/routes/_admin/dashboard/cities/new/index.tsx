import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/cities/new/')({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_admin/dashboard/cities/new/"!</div>;
}
