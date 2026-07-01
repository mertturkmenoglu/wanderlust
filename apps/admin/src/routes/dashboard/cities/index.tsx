import { createFileRoute } from '@tanstack/react-router';
import { DefaultListPage } from '@/components/default/list-page';
import { citiesResource } from '@/resources/cities';
import { defaultSearchSchema } from '@/schemas/default-search-schema';

export const Route = createFileRoute('/dashboard/cities/')({
	component: RouteComponent,
	validateSearch: defaultSearchSchema,
	staticData: {
		breadcrumb: citiesResource.breadcrumb,
	},
});

function RouteComponent() {
	return (
		<DefaultListPage
			resource={citiesResource}
			render={(item) => <div>{item.name}</div>}
		/>
	);
}
