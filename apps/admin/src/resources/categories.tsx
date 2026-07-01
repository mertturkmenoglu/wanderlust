import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { type DataResource, defineResource, getDefaultLinks } from '@/lib/crud';
import { appLink } from '@/lib/link';
import { type Outputs, orpc } from '@/lib/orpc';

type Category = Outputs['categories']['get']['category'];

export const categoriesResource: DataResource<'categories', Category> =
	defineResource({
		resource: 'categories',
		breadcrumb: 'Categories',

		links: getDefaultLinks('categories'),

		extractors: {
			id: (category) => category.id.toString(),
			one: (data) => data.category,
			list: (data) => data.categories,
			title: (category) => category.name,
			description: (_category) => undefined,
			appLink: (category) =>
				appLink(`/search/places?category=${encodeURIComponent(category.name)}`),
		},

		useOne: (input) => {
			return useQuery(
				orpc.categories.get.queryOptions({ input: { id: +input.id } }),
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
	});
