import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { Container } from '@/components/container';
import { renderer } from '@/components/details/renderer';
import { Show } from '@/components/show';
import { defineRows } from '@/lib/define-rows';
import { reportsResource } from '@/resources/reports';

export const Route = createFileRoute('/dashboard/reports/$id/')({
	component: RouteComponent,
	staticData: {
		breadcrumb: 'Report Details',
	},
});

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

function RouteComponent() {
	const params = Route.useParams();
	const query = reportsResource.useOne({
		id: params.id,
	});

	const updateMutation = reportsResource.useUpdate();

	if (!query.data) {
		return null;
	}

	const { report } = query.data;

	const rows = defineRows([
		['ID', report.id],
		['Resource Type', report.resourceType],
		['Resource ID', report.resourceId],
		['Reporter ID', report.reporterId],
		['Reason', getReason(report.reason)],
		['Description', report.description],
		['Resolved', report.resolved ? 'Yes' : 'No'],
		[
			'Resolved At',
			report.resolvedAt === null ? '-' : renderer.Date(report.resolvedAt),
		],
		['Created At', renderer.Date(report.createdAt)],
		['Updated At', renderer.Date(report.updatedAt)],
		[
			'Actions',
			<div>
				<Button
					type="button"
					variant="link"
					disabled={updateMutation.isPending || report.resolved}
					onClick={() => {
						updateMutation.mutate({
							id: report.id,
							reason: report.reason,
							resolved: true,
							description: report.description ?? '',
						});
					}}
				>
					{report.resolved ? 'Resolved' : 'Mark as Resolved'}
				</Button>
			</div>,
		],
	]);

	return (
		<Container>
			<Show
				resource={reportsResource}
				input={{ id: report.id }}
				deleteInput={{ id: report.id }}
				rows={rows}
			/>
		</Container>
	);
}
