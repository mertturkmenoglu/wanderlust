import { createFileRoute } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { DefaultListPage } from '@/components/default/list-page';
import { placesResource } from '@/resources/places';
import { defaultSearchSchema } from '@/schemas/default-search-schema';

export const Route = createFileRoute('/dashboard/places/')({
	component: RouteComponent,
	validateSearch: defaultSearchSchema,
	staticData: {
		breadcrumb: placesResource.breadcrumb,
	},
});

function RouteComponent() {
	return (
		<DefaultListPage
			resource={placesResource}
			render={(item) => (
				<div className={cn('flex gap-2')}>
					<div className="font-medium">{item.name}</div>
					<div className="ml-auto text-muted-foreground text-sm">
						{item.address.city.name} / {item.address.city.countryCode}
					</div>
					<div className="text-primary text-sm">{item.category.name}</div>
				</div>
			)}
		/>
	);
}
