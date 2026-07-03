import { createFileRoute } from '@tanstack/react-router';
import { DefaultListPage } from '@/components/default/list-page';
import { getDefaultStaticData } from '@/lib/defaults';
import { addressesResource as r } from '@/resources/addresses';

export const Route = createFileRoute('/dashboard/addresses/')({
	component: RouteComponent,
	staticData: getDefaultStaticData(r, 'list'),
});

function RouteComponent() {
	return <DefaultListPage resource={r} />;
}
