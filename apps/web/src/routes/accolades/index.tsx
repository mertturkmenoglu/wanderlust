import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/accolades/')({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/a/"!</div>;
}
