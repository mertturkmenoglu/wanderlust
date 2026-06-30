import { createFileRoute, Link } from '@tanstack/react-router';
import { Separator } from '@wanderlust/ui/components/separator';
import { cn } from '@wanderlust/ui/lib/utils';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Container } from '@/components/container';
import { DenseList } from '@/components/dense-list';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { orpc } from '@/lib/orpc';

export const Route = createFileRoute('/dashboard/cities/')({
	component: RouteComponent,
	loader: async ({ context }) =>
		context.queryClient.ensureQueryData(
			orpc.cities.list.queryOptions({
				input: {},
			}),
		),
	staticData: {
		breadcrumb: 'Cities',
	},
});

function RouteComponent() {
	const { cities } = Route.useLoaderData();
	const crumbs = useBreadcrumbs();

	return (
		<Container>
			<Breadcrumbs crumbs={crumbs} />

			<Separator className="my-4" />

			<DenseList
				data={cities}
				keyExtractor={(c) => c.id.toString()}
				renderItem={(item, className) => (
					<div className={cn(className)}>
						<Link to="/dashboard/cities/$id" params={{ id: `${item.id}` }}>
							{item.name}
						</Link>
					</div>
				)}
			/>
		</Container>
	);
}
