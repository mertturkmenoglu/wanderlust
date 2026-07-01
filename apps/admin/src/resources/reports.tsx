import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { type DataResource, defineResource, getDefaultLinks } from '@/lib/crud';
import { appLink } from '@/lib/link';
import { type Outputs, orpc } from '@/lib/orpc';

type Report = Outputs['reports']['list']['reports'][number];

export const reportsResource: DataResource<'reports', Report> = defineResource({
	resource: 'reports',
	breadcrumb: 'Reports',

	links: getDefaultLinks('reports'),

	extractors: {
		id: (report) => report.id,
		one: (data) => data.report,
		list: (data) => data.reports,
		title: (report) => report.id,
		description: (report) => report.description ?? 'No description available.',
		appLink: (_report) => appLink('/'),
	},

	useOne: (input) => {
		return useQuery(orpc.reports.get.queryOptions({ input: { id: input.id } }));
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
});
