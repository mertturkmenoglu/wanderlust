import { createFileRoute, Link } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Container } from '@/components/container';
import { DenseList } from '@/components/dense-list';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { orpc } from '@/lib/orpc';

export const Route = createFileRoute('/dashboard/categories/')({
	component: RouteComponent,
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(
			orpc.categories.list.queryOptions({
				input: {},
			}),
		),
	staticData: {
		breadcrumb: 'Categories',
	},
});

function RouteComponent() {
	const { categories } = Route.useLoaderData();
	const crumbs = useBreadcrumbs();

	return (
		<Container>
			<Breadcrumbs crumbs={crumbs} />

			<DenseList
				data={categories}
				className="mt-4"
				keyExtractor={(c) => `category-${c.id}`}
				renderItem={(item, className) => (
					<div className={cn(className)}>
						<Link to="/dashboard/categories/$id" params={{ id: `${item.id}` }}>
							{item.name}
						</Link>
					</div>
				)}
			/>
		</Container>
	);
}
