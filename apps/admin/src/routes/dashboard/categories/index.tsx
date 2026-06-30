import { createFileRoute, Link } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { Container } from '@/components/container';
import { DenseList } from '@/components/dense-list';
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

	return (
		<Container>
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
