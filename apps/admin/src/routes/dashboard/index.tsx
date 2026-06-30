import { createFileRoute, Link } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { Container } from '@/components/container';

export const Route = createFileRoute('/dashboard/')({
	component: RouteComponent,
	staticData: {
		breadcrumb: 'Actions',
	},
});

function RouteComponent() {
	return (
		<Container>
			<div className="my-8 flex flex-row flex-wrap gap-4">
				<Item variant="outline">
					<ItemContent>
						<ItemTitle>Categories</ItemTitle>
					</ItemContent>
					<ItemActions className="ml-16 flex gap-4">
						<Link
							to="/dashboard/categories"
							className={buttonVariants({ variant: 'default' })}
						>
							View
						</Link>
						<Link
							to="/dashboard/categories/new"
							className={buttonVariants({ variant: 'default' })}
						>
							New
						</Link>
					</ItemActions>
				</Item>

				<Item variant="outline">
					<ItemContent>
						<ItemTitle>Cities</ItemTitle>
					</ItemContent>
					<ItemActions className="ml-16 flex gap-4">
						<Link
							to="/dashboard/cities"
							className={buttonVariants({ variant: 'default' })}
						>
							View
						</Link>
						<Link
							to="/dashboard/cities/new"
							className={buttonVariants({ variant: 'default' })}
						>
							New
						</Link>
					</ItemActions>
				</Item>

				<Item variant="outline">
					<ItemContent>
						<ItemTitle>Reports</ItemTitle>
					</ItemContent>
					<ItemActions className="ml-16 flex gap-4">
						<Link
							to="/dashboard/reports"
							className={buttonVariants({ variant: 'default' })}
						>
							View
						</Link>
					</ItemActions>
				</Item>

				<Item variant="outline">
					<ItemContent>
						<ItemTitle>Places</ItemTitle>
					</ItemContent>
					<ItemActions className="ml-16 flex gap-4">
						<Link
							to="/dashboard/places"
							className={buttonVariants({ variant: 'default' })}
						>
							View
						</Link>
						<Link
							to="/dashboard/places/new"
							className={buttonVariants({ variant: 'default' })}
						>
							New
						</Link>
					</ItemActions>
				</Item>

				<Item variant="outline">
					<ItemContent>
						<ItemTitle>Users</ItemTitle>
					</ItemContent>
					<ItemActions className="ml-16 flex gap-4">
						<Link
							to="/dashboard/users"
							className={buttonVariants({ variant: 'default' })}
						>
							View
						</Link>
					</ItemActions>
				</Item>
			</div>
		</Container>
	);
}
