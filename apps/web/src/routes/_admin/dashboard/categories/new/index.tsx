import { createFileRoute } from '@tanstack/react-router';
import { UpsertCategory } from '../-upsert';

export const Route = createFileRoute('/_admin/dashboard/categories/new/')({
	component: RouteComponent,
});

function RouteComponent() {
	return <UpsertCategory action="create" />;
}
