import { getRouteApi, Link } from '@tanstack/react-router';
import {
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Breadcrumb as ShadcnBreadcrumb,
} from '@wanderlust/ui/components/breadcrumb';

export function Breadcrumb() {
	const route = getRouteApi('/p/$id/');
	const { place } = route.useLoaderData();

	return (
		<ShadcnBreadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link to="/">Home</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				<BreadcrumbSeparator />

				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link
							to="/cities/$"
							params={{
								_splat: `${place.address.cityId}`,
							}}
						>
							{place.address.city.name}
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				<BreadcrumbSeparator />

				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link
							to="/search"
							search={{
								category: place.category.name,
							}}
						>
							{place.category.name}
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				<BreadcrumbSeparator />

				<BreadcrumbItem>
					<BreadcrumbPage className="capitalize">{place.name}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</ShadcnBreadcrumb>
	);
}
