import { createFileRoute } from '@tanstack/react-router';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Container } from '@/components/container';
import { UnderlineLink } from '@/components/underline-link';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';

export const Route = createFileRoute('/dashboard/')({
	component: RouteComponent,
	staticData: {
		breadcrumb: 'Dashboard',
	},
});

function RouteComponent() {
	const crumbs = useBreadcrumbs();

	return (
		<Container>
			<Breadcrumbs crumbs={crumbs} />

			<div className="my-32 flex w-64 flex-col gap-2">
				<UnderlineLink to="/dashboard/categories">Categories</UnderlineLink>

				<UnderlineLink to="/dashboard/categories/new">
					New Category
				</UnderlineLink>

				<UnderlineLink to="/dashboard/cities">Cities</UnderlineLink>

				<UnderlineLink to="/dashboard/cities/new">New City</UnderlineLink>

				<UnderlineLink
					to="/dashboard/reports"
					search={{ page: 1, pageSize: 20 }}
				>
					Reports
				</UnderlineLink>
			</div>
		</Container>
	);
}
