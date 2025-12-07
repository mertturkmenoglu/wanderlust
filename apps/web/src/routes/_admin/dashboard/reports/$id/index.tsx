import { useMutation } from '@tanstack/react-query';
import {
	createFileRoute,
	Link,
	linkOptions,
	useNavigate,
} from '@tanstack/react-router';
import {
	Item,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { Separator } from '@wanderlust/ui/components/separator';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { CheckIcon, PaperclipIcon } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { DashboardActions } from '@/components/dashboard/actions';
import { DashboardBreadcrumb } from '@/components/dashboard/breadcrumb';
import { keyValueCols } from '@/components/dashboard/columns';
import { DataTable } from '@/components/dashboard/data-table';
import { DeleteDialog } from '@/components/dashboard/delete-dialog';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

export const Route = createFileRoute('/_admin/dashboard/reports/$id/')({
	component: RouteComponent,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			context.orpc.reports.get.queryOptions({
				input: {
					id: params.id,
				},
			}),
		);
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

	const link = useMemo(() => {
		if (report.resourceType === 'place') {
			return linkOptions({
				to: '/p/$id',
				params: {
					id: report.resourceId,
				},
			});
		}

		return linkOptions({
			to: '.',
		});
	}, [report.resourceId, report.resourceType]);

	const invalidate = useInvalidator();
	const navigate = useNavigate();

	const deleteMutation = useMutation(
		orpc.reports.delete.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				await navigate({ to: '/dashboard/reports' });
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
		<div>
			<DashboardBreadcrumb
				items={[
					{ name: 'Reports', href: '/dashboard/reports' },
					{
						name: 'Detail',
						href: `/dashboard/reports/${report.id}`,
					},
				]}
			/>

			<Separator className="my-2" />

			<DashboardActions>
				<div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
					<Link {...link}>
						<Item variant="outline" className="hover:bg-muted">
							<ItemMedia variant="icon">
								<PaperclipIcon />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Go to resource</ItemTitle>
							</ItemContent>
						</Item>
					</Link>

					<button
						type="button"
						disabled={updateMutation.isPending || report.resolved}
						onClick={() => {
							updateMutation.mutate({
								id: report.id,
								reason: report.reason,

								resolved: true,
								description: report.description ?? '',
							});
						}}
						className="group disabled:cursor-not-allowed"
					>
						<Item
							variant="outline"
							className="hover:bg-muted group-disabled:bg-muted"
						>
							<ItemMedia variant="icon">
								<CheckIcon />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>
									{updateMutation.isPending && <Spinner className="size-4" />}
									{report.resolved ? 'Resolved' : 'Mark as Resolved'}
								</ItemTitle>
							</ItemContent>
						</Item>
					</button>

					<DeleteDialog
						type="report"
						onClick={() => {
							deleteMutation.mutate({
								id: report.id,
							});
						}}
					/>
				</div>
			</DashboardActions>

			<DataTable
				columns={keyValueCols}
				filterColumnId=""
				data={[
					{
						k: 'ID',
						v: report.id,
					},
					{
						k: 'Resource ID',
						v: report.resourceId,
					},
					{
						k: 'Resource Type',
						v: report.resourceType,
					},
					{
						k: 'Reporter ID',
						v: report.reporterId ?? '-',
					},
					{
						k: 'Description',
						v: report.description ?? '-',
					},
					{
						k: 'Reason',
						v: getReason(report.reason),
					},
					{
						k: 'Resolved',
						v: report.resolved ? 'Yes' : 'No',
					},
					{
						k: 'Resolved At',
						v: report.resolvedAt?.toISOString() ?? '-',
					},
					{
						k: 'Created At',
						v: report.createdAt.toISOString(),
					},
					{
						k: 'Updated At',
						v: report.updatedAt.toISOString(),
					},
				]}
			/>
		</div>
	);
}
