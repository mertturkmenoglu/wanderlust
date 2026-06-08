import { createFileRoute } from '@tanstack/react-router';
import { Upsert } from '../-upsert';

export const Route = createFileRoute('/dashboard/cities/new/')({
	component: RouteComponent,
});

function RouteComponent() {
	return <Upsert action="create" />;
}
