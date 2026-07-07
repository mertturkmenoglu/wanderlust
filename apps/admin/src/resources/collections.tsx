import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { ResourceBuilder } from '@/lib/crud';
import { appLink } from '@/lib/link';
import { type Outputs, orpc } from '@/lib/orpc';

export type Collection = Outputs['collections']['get']['collection'];

export const collectionsResource = new ResourceBuilder<
	'collections',
	Collection
>('collections')
	.addDefaultLinks()
	.addExtractors({
		id: (v) => v.id,
		title: (v) => v.name,
		description: (v) => v.description,
		appLink: (v) => appLink(`/collections/${v.id}`),
		one: (data) => data.collection,
		list: (data) => {
			return data.collections.map((c) => ({
				...c,
				items: [],
			}));
		},
	})
	.addDefaultBreadcrumbs()
	.addColumns([
		{
			accessorKey: 'id',
			header: 'ID',
		},
		{
			accessorKey: 'name',
			header: 'Name',
		},
		{
			accessorFn: (row) =>
				row.description.slice(0, 50) +
				(row.description.length > 50 ? '...' : ''),
			header: 'Description',
		},
		{
			accessorFn: (row) =>
				formatDistanceToNow(row.createdAt, { addSuffix: true }),
			header: 'Created At',
		},
	])
	.addOptions({
		one: () => orpc.collections.get,
		list: () => orpc.collections.list,
		create: () => orpc.collections.create,
		update: () => orpc.collections.update,
		delete: () => orpc.collections.delete,
	})
	.addHooks({
		useOne: (input) => {
			return useQuery(
				orpc.collections.get.queryOptions({
					input: {
						id: input.id,
					},
				}),
			);
		},

		useList: (_input) => {
			return useQuery(
				orpc.collections.list.queryOptions({
					input: {
						page: 1,
						pageSize: 20,
					},
				}),
			);
		},

		useCreate: () => {
			const invalidate = useInvalidator();
			const navigate = useNavigate();

			return useMutation(
				orpc.collections.create.mutationOptions({
					onSuccess: async (data) => {
						await invalidate();
						await navigate(
							collectionsResource.links.details(data.collection.id),
						);

						toast.success('Collection created successfully');
					},
				}),
			);
		},

		useUpdate: () => {
			const invalidate = useInvalidator();

			return useMutation(
				orpc.collections.update.mutationOptions({
					onSuccess: async () => {
						await invalidate();
						toast.success('Collection updated successfully');
					},
				}),
			);
		},

		useDelete: () => {
			const navigate = useNavigate();
			const invalidate = useInvalidator();

			return useMutation(
				orpc.collections.delete.mutationOptions({
					onSuccess: async () => {
						await navigate({
							to: collectionsResource.links.list.to,
						});

						await invalidate();

						toast.success('Collection deleted successfully');
					},
				}),
			);
		},
	})
	.build();
