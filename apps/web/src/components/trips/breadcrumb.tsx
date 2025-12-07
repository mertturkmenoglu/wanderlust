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
	name: string;
	href: string;
};

type Props = {
	items: TItem[];
};

export function Breadcrumb({ items }: Readonly<Props>) {
	return (
		<ShadcnBreadcrumb>
			<BreadcrumbList className="text-lg">
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link to="/trips">Trips</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				{items.slice(0, -1).map((item) => (
					<div
						key={item.href}
						className="wrap-break-word flex flex-wrap items-center gap-1.5 sm:gap-2.5"
					>
						<BreadcrumbSeparator className="text-primary" />
						<BreadcrumbItem key={item.name}>
							<BreadcrumbLink asChild>
								<Link to={item.href}>{item.name}</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
					</div>
				))}
				<BreadcrumbSeparator className="text-primary" />
				<BreadcrumbItem>
					<BreadcrumbPage>{items.at(-1)?.name ?? '-'}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</ShadcnBreadcrumb>
	);
}
