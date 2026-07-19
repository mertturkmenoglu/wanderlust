import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { ResourceBuilder } from '@/lib/crud';
import { appLink } from '@/lib/link';
import { type Outputs, orpc } from '@/lib/orpc';

export type Category = Outputs['categories']['get']['category'];

export const categoriesResource = new ResourceBuilder<'categories', Category>(
	'categories',
)
	.addDefaultLinks()
	.addExtractors({
		id: (category) => category.id,
		one: (data) => data.category,
		list: (data) => data.categories,
		title: (category) => category.name,
		description: (_category) => undefined,
		appLink: (category) =>
			appLink(`/search/places?category=${encodeURIComponent(category.name)}`),
		pagination: (data) => ({
			hasNext: false,
			hasPrevious: false,
			page: 1,
			pageSize: data.categories.length,
			totalPages: 1,
			totalRecords: data.categories.length,
		}),
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
			accessorKey: 'displayName',
			header: 'Display Name',
		},
		{
			accessorKey: 'description',
			header: 'Description',
		},
		{
			accessorKey: 'image',
			header: 'Image',
			cell: (info) => (
				<img
					src={info.getValue() as string}
					alt={info.row.original.name}
					className="aspect-video h-16 object-cover"
				/>
			),
		},
	])
	.addOptions({
		one: () => orpc.categories.get,
		list: () => orpc.categories.list,
		create: () => orpc.categories.create,
		update: () => orpc.categories.update,
		delete: () => orpc.categories.delete,
	})
	.addHooks({
		useOne: (input) => {
			return useQuery(
				orpc.categories.get.queryOptions({ input: { id: input.id } }),
			);
		},

		useList: (_input) => {
			return useQuery(orpc.categories.list.queryOptions({ input: {} }));
		},

		useCreate: () => {
			return useMutation(orpc.categories.create.mutationOptions({}));
		},

		useUpdate: () => {
			return useMutation(orpc.categories.update.mutationOptions({}));
		},

		useDelete: () => {
			const navigate = useNavigate();
			const invalidate = useInvalidator();

			return useMutation(
				orpc.categories.delete.mutationOptions({
					onSuccess: async () => {
						await navigate({ to: categoriesResource.links.list.to });
						await invalidate();

						toast.success('Deleted successfully');
					},
				}),
			);
		},
	})
	.build();
