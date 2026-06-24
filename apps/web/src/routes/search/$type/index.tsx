import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/search/$type/')({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/search/$type/"!</div>;
}
