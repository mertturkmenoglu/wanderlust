import { createFileRoute, Link } from '@tanstack/react-router';
import {
	Card,
	CardAction,
	CardHeader,
	CardTitle,
} from '@wanderlust/ui/components/card';
import { ArrowRightIcon } from 'lucide-react';
import { Container } from '@/components/container';
import { toTitleCase } from '@/lib/text';
import { accoladesResource } from '@/resources/accolades';
import { categoriesResource } from '@/resources/categories';
import { citiesResource } from '@/resources/cities';
import { collectionsResource } from '@/resources/collections';
import { placesResource } from '@/resources/places';
import { reportsResource } from '@/resources/reports';

export const Route = createFileRoute('/dashboard/')({
	component: RouteComponent,
	staticData: {
		breadcrumbs: () => [
			{
				label: 'Dashboard',
				link: {
					to: '/dashboard',
				} as const,
			},
		],
	},
});

const resources = [
	accoladesResource,
	categoriesResource,
	citiesResource,
	collectionsResource,
	reportsResource,
	placesResource,
];

function RouteComponent() {
	return (
		<Container title="Dashboard">
			<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
				{resources.map((r) => (
					<Link key={r.resource} {...r.links.list}>
						<Card className="rounded-none! hover:bg-muted">
							<CardHeader className="h-16">
								<CardTitle>{toTitleCase(r.resource)}</CardTitle>
								<CardAction>
									<ArrowRightIcon className="size-4" />
								</CardAction>
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>
		</Container>
	);
}
