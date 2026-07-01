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
			<div className="my-8 flex flex-col gap-4">
				<Item variant="outline">
					<ItemContent>
						<ItemTitle>Categories</ItemTitle>
					</ItemContent>
					<ItemActions className="ml-16 flex">
						<Link
							to="/dashboard/categories"
							className={buttonVariants({ variant: 'link' })}
						>
							View
						</Link>
						<Link
							to="/dashboard/categories/new"
							className={buttonVariants({ variant: 'link' })}
						>
							New
						</Link>
					</ItemActions>
				</Item>

				<Item variant="outline">
					<ItemContent>
						<ItemTitle>Cities</ItemTitle>
					</ItemContent>
					<ItemActions className="ml-16 flex">
						<Link
							to="/dashboard/cities"
							className={buttonVariants({ variant: 'link' })}
						>
							View
						</Link>
						<Link
							to="/dashboard/cities/new"
							className={buttonVariants({ variant: 'link' })}
						>
							New
						</Link>
					</ItemActions>
				</Item>

				<Item variant="outline">
					<ItemContent>
						<ItemTitle>Reports</ItemTitle>
					</ItemContent>
					<ItemActions className="ml-16 flex">
						<Link
							to="/dashboard/reports"
							className={buttonVariants({ variant: 'link' })}
						>
							View
						</Link>
					</ItemActions>
				</Item>

				<Item variant="outline">
					<ItemContent>
						<ItemTitle>Places</ItemTitle>
					</ItemContent>
					<ItemActions className="ml-16 flex">
						<Link
							to="/dashboard/places"
							className={buttonVariants({ variant: 'link' })}
						>
							View
						</Link>
						<Link
							to="/dashboard/places/new"
							className={buttonVariants({ variant: 'link' })}
						>
							New
						</Link>
					</ItemActions>
				</Item>

				<Item variant="outline">
					<ItemContent>
						<ItemTitle>Users</ItemTitle>
					</ItemContent>
					<ItemActions className="ml-16 flex">
						<Link
							to="/dashboard/users"
							className={buttonVariants({ variant: 'link' })}
						>
							View
						</Link>
					</ItemActions>
				</Item>
			</div>
		</Container>
	);
}
