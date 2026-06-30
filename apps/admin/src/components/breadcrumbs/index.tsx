import { Link } from '@tanstack/react-router';
import {
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Breadcrumb as ShadcnBreadcrumb,
} from '@wanderlust/ui/components/breadcrumb';

type TItem = {
	label: string;
	path: string;
};

type Props = {
	crumbs: TItem[];
};

export function Breadcrumbs({ crumbs }: Readonly<Props>) {
	return (
		<ShadcnBreadcrumb>
			<BreadcrumbList className="text-lg">
				{crumbs.slice(0, -1).map((item, i) => (
					<div
						key={`crumb-${item.path}-${i}`}
						className="wrap-break-word flex flex-wrap items-center gap-1.5"
					>
						<BreadcrumbItem key={item.label}>
							<BreadcrumbLink asChild>
								<Link to={item.path}>{item.label}</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="text-primary" />
					</div>
				))}
				<BreadcrumbItem>
					<BreadcrumbPage>{crumbs.at(-1)?.label ?? '-'}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</ShadcnBreadcrumb>
	);
}
