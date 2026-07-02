import { createFileRoute, Link } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { Container } from '@/components/container';
import { accoladesResource } from '@/resources/accolades';
import { categoriesResource } from '@/resources/categories';
import { citiesResource } from '@/resources/cities';
import { placesResource } from '@/resources/places';
import { reportsResource } from '@/resources/reports';

export const Route = createFileRoute('/dashboard/')({
	component: RouteComponent,
	staticData: {
		breadcrumb: 'Actions',
	},
});

const resources = [
	accoladesResource,
	categoriesResource,
	citiesResource,
	reportsResource,
	placesResource,
];

function RouteComponent() {
	return (
		<Container>
			<div className="my-8 flex flex-col gap-4">
				{resources.map((r) => (
					<Item key={r.resource} variant="outline">
						<ItemContent>
							<ItemTitle className="capitalize">{r.resource}</ItemTitle>
						</ItemContent>
						<ItemActions className="ml-16 flex">
							<Link
								{...r.links.list}
								className={buttonVariants({ variant: 'link' })}
							>
								View
							</Link>
							<Link
								{...r.links.new}
								className={buttonVariants({ variant: 'link' })}
							>
								New
							</Link>
						</ItemActions>
					</Item>
				))}
			</div>
		</Container>
	);
}
