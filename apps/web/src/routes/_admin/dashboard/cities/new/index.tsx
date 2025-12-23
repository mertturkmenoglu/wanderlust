import { createFileRoute } from '@tanstack/react-router';
import { UpsertCity } from '../-upsert';

export const Route = createFileRoute('/_admin/dashboard/cities/new/')({
	component: RouteComponent,
});

function RouteComponent() {
	return <UpsertCity action="create" />;
}
