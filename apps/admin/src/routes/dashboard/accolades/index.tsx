import { createFileRoute } from '@tanstack/react-router';
import { DefaultListPage } from '@/components/default/list-page';
import { accoladesResource } from '@/resources/accolades';
import { defaultSearchSchema } from '@/schemas/default-search-schema';

export const Route = createFileRoute('/dashboard/accolades/')({
	component: RouteComponent,
	validateSearch: defaultSearchSchema,
	staticData: {
		breadcrumb: accoladesResource.breadcrumb,
	},
});

function RouteComponent() {
	return (
		<DefaultListPage
			resource={accoladesResource}
			render={(item) => <div>{item.title}</div>}
		/>
	);
}
