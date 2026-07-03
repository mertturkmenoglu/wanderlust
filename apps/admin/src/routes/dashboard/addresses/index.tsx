import { createFileRoute } from '@tanstack/react-router';
import { DefaultListPage } from '@/components/default/list-page';
import { addressesResource } from '@/resources/addresses';

export const Route = createFileRoute('/dashboard/addresses/')({
	component: RouteComponent,
	staticData: {
		breadcrumb: addressesResource.breadcrumb,
	},
});

function RouteComponent() {
	return (
		<DefaultListPage
			resource={addressesResource}
			render={(item) => (
				<div className="flex flex-row justify-between gap-4">
					<div className="text-sm">
						{item.line1}, {item.line2}, {item.postalCode}
					</div>
					<div className="text-muted-foreground text-sm">
						{item.city.name}, {item.city.stateName}, {item.city.countryName}
					</div>
				</div>
			)}
		/>
	);
}
