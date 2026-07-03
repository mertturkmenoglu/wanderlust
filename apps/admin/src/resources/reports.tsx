import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { ResourceBuilder } from '@/lib/crud';
import { appLink } from '@/lib/link';
import { type Outputs, orpc } from '@/lib/orpc';

export type Report = Outputs['reports']['list']['reports'][number];

export const reportsResource = new ResourceBuilder<'reports', Report>('reports')
	.addDefaultLinks()
	.addExtractors({
		id: (report) => report.id,
		title: (report) => report.id,
		description: (report) => report.description ?? 'No description available.',
		appLink: (_report) => appLink('/'),
		one: (data) => data.report,
		list: (data) => data.reports,
	})
	.addDefaultBreadcrumbs()
	.addColumns([
		{
			accessorKey: 'id',
			header: 'ID',
		},
		{
			accessorKey: 'resourceId',
			header: 'Resource ID',
		},
		{
			accessorKey: 'resourceType',
			header: 'Resource Type',
		},
		{
			accessorKey: 'reporterId',
			header: 'Reporter ID',
		},
		{
			accessorKey: 'reason',
			header: 'Reason',
		},
		{
			accessorKey: 'resolved',
			header: 'Resolved',
			cell: (info) => (info.getValue() ? 'Yes' : 'No'),
		},
		{
			accessorKey: 'resolvedAt',
			header: 'Resolved At',
			cell: (info) =>
				info.getValue()
					? formatDistanceToNow(new Date(info.getValue() as string), {
							addSuffix: true,
						})
					: 'Not resolved',
		},
		{
			accessorKey: 'createdAt',
			header: 'Created At',
			cell: (info) =>
				formatDistanceToNow(new Date(info.getValue() as string), {
					addSuffix: true,
				}),
		},
		{
			accessorKey: 'updatedAt',
			header: 'Updated At',
			cell: (info) =>
				formatDistanceToNow(new Date(info.getValue() as string), {
					addSuffix: true,
				}),
		},
	])
	.addOptions({
		one: () => orpc.reports.get,
		list: () => orpc.reports.list,
		create: () => {
			throw new Error('Creating reports is not supported');
		},
		update: () => orpc.reports.update,
		delete: () => orpc.reports.delete,
	})
	.addHooks({
		useOne: (input) => {
			return useQuery(
				orpc.reports.get.queryOptions({ input: { id: input.id } }),
			);
		},

		useList: (_input) => {
			return useQuery(orpc.reports.list.queryOptions({ input: {} }));
		},

		useCreate: () => {
			throw new Error('Creating reports is not supported');
		},

		useUpdate: () => {
			return useMutation(orpc.reports.update.mutationOptions({}));
		},

		useDelete: () => {
			const navigate = useNavigate();
			const invalidate = useInvalidator();

			return useMutation(
				orpc.reports.delete.mutationOptions({
					onSuccess: async () => {
						await navigate({ to: reportsResource.links.list.to });
						await invalidate();

						toast.success('Deleted successfully');
					},
				}),
			);
		},
	})
	.build();
