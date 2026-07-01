import { createFileRoute } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';
import { DefaultListPage } from '@/components/default/list-page';
import { reportsResource } from '@/resources/reports';
import { defaultSearchSchema } from '@/schemas/default-search-schema';

const reasons = [
	{
		id: 1,
		name: 'Spam',
	},
	{
		id: 2,
		name: 'Inappropriate',
	},
	{
		id: 3,
		name: 'Fake',
	},
	{
		id: 4,
		name: 'Other',
	},
];

function getReason(r: number) {
	return reasons.find((x) => x.id === r)?.name ?? 'Other';
}

export const Route = createFileRoute('/dashboard/reports/')({
	component: RouteComponent,
	validateSearch: defaultSearchSchema,
	staticData: {
		breadcrumb: 'Reports',
	},
});

function RouteComponent() {
	return (
		<DefaultListPage
			resource={reportsResource}
			render={(item) => (
				<div className="flex items-center gap-2">
					<div className="font-medium">
						{item.resourceType}={item.id}
					</div>
					<div className="text-muted-foreground text-sm">
						Reason: {getReason(item.reason)}
					</div>
					<div className="text-muted-foreground text-sm">
						Resolved: {item.resolved ? 'Yes' : 'No'}
					</div>
					<div className="ml-auto text-muted-foreground text-xs">
						{formatDistanceToNow(item.createdAt, {
							addSuffix: true,
						})}
					</div>
				</div>
			)}
		/>
	);
}
