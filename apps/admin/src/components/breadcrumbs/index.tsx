import { Link } from '@tanstack/react-router';
import {
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Breadcrumb as ShadcnBreadcrumb,
} from '@wanderlust/ui/components/breadcrumb';
import { SlashIcon } from 'lucide-react';
import type { TDataBreadcrumb } from '@/lib/crud';
import { Logo } from '../logo';

type Props = {
	crumbs: TDataBreadcrumb[];
};

export function Breadcrumbs({ crumbs }: Readonly<Props>) {
	return (
		<ShadcnBreadcrumb>
			<BreadcrumbList>
				<Logo variant="xs" />
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link to="/dashboard">Dashboard</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				<BreadcrumbSeparator className="text-muted-foreground">
					<SlashIcon className="rotate-[-30deg]" />
				</BreadcrumbSeparator>

				{crumbs.slice(0, -1).map((item, i) => (
					<div
						key={`crumb-${item.link.to}-${i}`}
						className="wrap-break-word flex flex-wrap items-center gap-1.5"
					>
						<BreadcrumbItem key={item.label}>
							<BreadcrumbLink asChild>
								<Link {...item.link}>{item.label}</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="text-muted-foreground">
							<SlashIcon className="rotate-[-30deg]" />
						</BreadcrumbSeparator>
					</div>
				))}
				<BreadcrumbItem>
					<BreadcrumbPage>{crumbs.at(-1)?.label ?? '-'}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</ShadcnBreadcrumb>
	);
}
