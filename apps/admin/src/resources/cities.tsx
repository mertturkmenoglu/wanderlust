import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { ResourceBuilder } from '@/lib/crud';
import { appLink } from '@/lib/link';
import { type Outputs, orpc } from '@/lib/orpc';

export type City = Outputs['cities']['get']['city'];

export const citiesResource = new ResourceBuilder<'cities', City>('cities')
	.addDefaultLinks()
	.addExtractors({
		id: (city) => city.id.toString(),
		title: (city) => city.name,
		description: (city) => city.description,
		appLink: (city) => appLink(`/cities/${city.id}`),
		one: (data) => data.city,
		list: (data) => data.cities,
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
			accessorKey: 'stateName',
			header: 'State',
		},
		{
			accessorKey: 'countryName',
			header: 'Country',
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
		one: () => orpc.cities.get,
		list: () => orpc.cities.list,
		create: () => orpc.cities.create,
		update: () => orpc.cities.update,
		delete: () => orpc.cities.delete,
	})
	.addHooks({
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
	})
	.build();
