import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { renderer } from '@/components/details/renderer';
import { Show } from '@/components/show';
import { ensureData, getDefaultStaticData } from '@/lib/defaults';
import { defineRows } from '@/lib/define-rows';
import { reportsResource as r } from '@/resources/reports';

export const Route = createFileRoute('/dashboard/reports/$id/')({
	component: RouteComponent,
	loader: async ({ params, context }) => {
		return ensureData(r, context.qc, {
			input: {
				id: params.id,
			},
		});
	},
	staticData: getDefaultStaticData(r, 'details'),
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
	const { report } = Route.useLoaderData();
	const mutation = r.useUpdate();

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
					disabled={mutation.isPending || report.resolved}
					onClick={() => {
						mutation.mutate({
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
		<Show
			resource={r}
			input={{
				id: report.id,
			}}
			deleteInput={{
				id: report.id,
			}}
			rows={rows}
			data={report}
		/>
	);
}
