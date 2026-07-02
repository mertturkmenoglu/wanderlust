import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { type DataResource, defineResource, getDefaultLinks } from '@/lib/crud';
import { appLink } from '@/lib/link';
import { type Outputs, orpc } from '@/lib/orpc';

type Accolade = Outputs['accolades']['get']['accolade'];

export const accoladesResource: DataResource<'accolades', Accolade> =
	defineResource({
		resource: 'accolades',
		breadcrumb: 'Accolades',
		links: getDefaultLinks('accolades'),

		extractors: {
			id: (accolade) => accolade.id,
			title: (accolade) => accolade.title,
			description: (accolade) => accolade.description,
			appLink: (accolade) => appLink(`/accolades/${accolade.id}`),
			one: (data) => data.accolade,
			list: (data) => data.accolades,
		},

		useOne: (input) => {
			return useQuery(
				orpc.accolades.get.queryOptions({
					input: {
						id: input.id,
					},
				}),
			);
		},

		useList: (_input) => {
			return useQuery(
				orpc.accolades.list.queryOptions({
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
				orpc.accolades.create.mutationOptions({
					onSuccess: async (data) => {
						await invalidate();
						await navigate(accoladesResource.links.details(data.accolade.id));

						toast.success('Accolade created successfully');
					},
				}),
			);
		},

		useUpdate: () => {
			const invalidate = useInvalidator();

			return useMutation(
				orpc.accolades.update.mutationOptions({
					onSuccess: async () => {
						await invalidate();
						toast.success('Accolade updated successfully');
					},
				}),
			);
		},

		useDelete: () => {
			const navigate = useNavigate();
			const invalidate = useInvalidator();

			return useMutation(
				orpc.accolades.delete.mutationOptions({
					onSuccess: async () => {
						await navigate({
							to: accoladesResource.links.list.to,
						});

						await invalidate();

						toast.success('Accolade deleted successfully');
					},
				}),
			);
		},
	});
