import { createFileRoute } from '@tanstack/react-router';
import { DefaultListPage } from '@/components/default/list-page';
import { categoriesResource } from '@/resources/categories';
import { defaultSearchSchema } from '@/schemas/default-search-schema';

export const Route = createFileRoute('/dashboard/categories/')({
	component: RouteComponent,
	validateSearch: defaultSearchSchema,
	staticData: {
		breadcrumb: categoriesResource.breadcrumb,
	},
});

function RouteComponent() {
	return (
		<DefaultListPage
			resource={categoriesResource}
			render={(item) => <div>{item.name}</div>}
		/>
	);
}
