import { createFileRoute } from '@tanstack/react-router';
import { UpsertCollection } from '../-upsert';

export const Route = createFileRoute('/dashboard/collections/new/')({
	component: RouteComponent,
});

function RouteComponent() {
	return <UpsertCollection action="create" />;
}
