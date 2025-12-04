import { createFileRoute } from '@tanstack/react-router';
import {
	ClipboardListIcon,
	LibraryIcon,
	MapIcon,
	MapPinnedIcon,
	TagIcon,
	UsersIcon,
} from 'lucide-react';
import { DashboardBreadcrumb } from '@/components/blocks/dashboard/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { DashboardItem } from './-item';

export const Route = createFileRoute('/_admin/dashboard/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<DashboardBreadcrumb items={[{ name: 'Home', href: '/dashboard' }]} />

			<Separator className="my-4" />

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				<DashboardItem
					href="/dashboard/categories"
					text="Categories"
					icon={TagIcon}
				/>

				<DashboardItem href="/dashboard/cities" text="Cities" icon={MapIcon} />

				<DashboardItem
					href="/dashboard/places"
					text="Places"
					icon={MapPinnedIcon}
				/>

				<DashboardItem href="/dashboard/users" text="Users" icon={UsersIcon} />

				<DashboardItem
					href="/dashboard/collections"
					text="Collections"
					icon={LibraryIcon}
				/>

				<DashboardItem
					href="/dashboard/reports"
					text="Reports"
					icon={ClipboardListIcon}
				/>
			</div>
		</div>
	);
}
