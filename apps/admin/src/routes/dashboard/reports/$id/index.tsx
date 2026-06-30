import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { toast } from 'sonner';
import { Container } from '@/components/container';
import { ObjectDetails } from '@/components/object-details';
import {
	DetailRow,
	DetailTable,
} from '@/components/object-details/detail-table';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

export const Route = createFileRoute('/dashboard/reports/$id/')({
	component: RouteComponent,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			orpc.reports.get.queryOptions({
				input: {
					id: params.id,
				},
			}),
		);
	},
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
	const { report } = Route.useLoaderData();
	const invalidate = useInvalidator();
	const navigate = Route.useNavigate();
	const confirm = useConfirmDialog();
	const qc = useQueryClient();

	const deleteMutation = useMutation(
		orpc.reports.delete.mutationOptions({
			onSuccess: async () => {
				await navigate({ to: '/dashboard/reports' });
				qc.removeQueries(
					orpc.reports.get.queryOptions({
						input: {
							id: report.id,
						},
					}),
				);
				await invalidate();
				toast.success('Report deleted');
			},
		}),
	);

	const updateMutation = useMutation(
		orpc.reports.update.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Report updated');
			},
		}),
	);

	return (
		<Container>
			{confirm.Dialog}

			<ObjectDetails
				object={{
					type: 'report',
					id: report.id,
					title: `Report ID=${report.id}`,
					description: report.description ?? 'No description available.',
				}}
				onEdit={() => {
					toast.error('Not supported');
				}}
				onVisit={() => {
					toast.error('Not supported');
				}}
				onShare={() => {
					toast.error('Not supported');
				}}
				onDelete={async () => {
					const ok = await confirm.confirm({
						variant: 'destructive',
						title: 'Delete Report',
						description:
							'Are you sure you want to delete this report? This action cannot be undone.',
						confirmText: 'Delete',
						cancelText: 'Cancel',
					});

					if (!ok) {
						return;
					}

					deleteMutation.mutate({
						id: report.id,
					});
				}}
				classNames={{
					root: 'my-4',
				}}
			>
				<DetailTable>
					<DetailRow label="ID" value={report.id} />
					<DetailRow label="Resource Type" value={report.resourceType} />
					<DetailRow label="Resource ID" value={report.resourceId} />
					<DetailRow label="Reporter ID" value={report.reporterId} />
					<DetailRow label="Reason" value={getReason(report.reason)} />
					<DetailRow label="Description" value={report.description} />
					<DetailRow label="Resolved" value={report.resolved ? 'Yes' : 'No'} />
					<DetailRow
						label="Resolved At"
						value={
							report.resolvedAt === null
								? '-'
								: `${new Date(report.resolvedAt).toISOString()}`
						}
					/>
					<DetailRow
						label="Created At"
						value={`${new Date(report.createdAt).toISOString()}`}
					/>
					<DetailRow
						label="Updated At"
						value={`${new Date(report.updatedAt).toISOString()}`}
					/>
				</DetailTable>

				<div className="mt-8">
					<Button
						type="button"
						variant="default"
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
				</div>
			</ObjectDetails>
		</Container>
	);
}
