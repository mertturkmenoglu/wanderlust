import { createFileRoute } from '@tanstack/react-router';
import { DefaultListPage } from '@/components/default/list-page';
import { getDefaultStaticData } from '@/lib/defaults';
import { accoladesResource } from '@/resources/accolades';
import { defaultSearchSchema } from '@/schemas/default-search-schema';

const r = accoladesResource;

export const Route = createFileRoute('/dashboard/accolades/')({
	component: RouteComponent,
	validateSearch: defaultSearchSchema,
	staticData: getDefaultStaticData(r, 'list'),
});

function RouteComponent() {
	return <DefaultListPage resource={accoladesResource} />;
}
