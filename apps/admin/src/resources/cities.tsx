import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { type DataResource, defineResource, getDefaultLinks } from '@/lib/crud';
import { appLink } from '@/lib/link';
import { type Outputs, orpc } from '@/lib/orpc';

type City = Outputs['cities']['get']['city'];

export const citiesResource: DataResource<'cities', City> = defineResource({
	resource: 'cities',
	breadcrumb: 'Cities',

	links: getDefaultLinks('cities'),

	extractors: {
		id: (city) => city.id.toString(),
		one: (data) => data.city,
		list: (data) => data.cities,
		title: (city) => city.name,
		description: (city) => city.description,
		appLink: (city) => appLink(`/cities/${city.id}`),
	},

	useOne: (input) => {
		return useQuery(
			orpc.cities.get.queryOptions({
				input: {
					id: +input.id,
				},
			}),
		);
	},

	useList: (_input) => {
		return useQuery(
			orpc.cities.list.queryOptions({
				input: {},
			}),
		);
	},

	useCreate: () => {
		return useMutation(orpc.cities.create.mutationOptions({}));
	},

	useUpdate: () => {
		return useMutation(orpc.cities.update.mutationOptions({}));
	},

	useDelete: () => {
		const navigate = useNavigate();
		const invalidate = useInvalidator();

		return useMutation(
			orpc.cities.delete.mutationOptions({
				onSuccess: async () => {
					await navigate({ to: citiesResource.links.list.to });
					await invalidate();

					toast.success('Deleted successfully');
				},
			}),
		);
	},
});
