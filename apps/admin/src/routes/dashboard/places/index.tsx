import { createFileRoute, Link } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { Container } from '@/components/container';
import { DenseList } from '@/components/dense-list';
import { orpc } from '@/lib/orpc';

export const Route = createFileRoute('/dashboard/places/')({
	component: RouteComponent,
	loader: async ({ context }) =>
		context.queryClient.ensureQueryData(
			orpc.places.peek.queryOptions({
				input: {},
			}),
		),
	staticData: {
		breadcrumb: 'Places',
	},
});

function RouteComponent() {
	const { places } = Route.useLoaderData();

	return (
		<Container>
			<DenseList
				className="my-4"
				data={places}
				keyExtractor={(p) => p.id}
				renderItem={(item, className) => (
					<Link to="/dashboard/places/$id" params={{ id: item.id }}>
						<div className={cn('flex gap-2', className)}>
							<div className="font-medium">{item.name}</div>
							<div className="ml-auto text-muted-foreground text-sm">
								{item.address.city.name} / {item.address.city.countryCode}
							</div>
							<div className="text-primary text-sm">{item.category.name}</div>
						</div>
					</Link>
				)}
			/>
		</Container>
	);
}
