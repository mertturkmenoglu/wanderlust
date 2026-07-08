import { useMutation, useQuery } from '@tanstack/react-query';
import { ResourceBuilder } from '@/lib/crud';
import { appLink } from '@/lib/link';
import { type Outputs, orpc } from '@/lib/orpc';

export type Place = Outputs['places']['get']['place'];

export const placesResource = new ResourceBuilder<'places', Place>('places')
	.addDefaultLinks()
	.addExtractors({
		id: (place) => place.id.toString(),
		title: (place) => place.name,
		description: (place) => place.description,
		appLink: (place) => appLink(`/p/${place.id}`),
		one: (data) => data.place,
		list: (data) => data.places,
		pagination: (data) => ({
			hasNext: false,
			hasPrevious: false,
			page: 1,
			pageSize: data.places.length,
			totalPages: 1,
			totalRecords: data.places.length,
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
			accessorKey: 'category.name',
			header: 'Category',
		},
		{
			accessorKey: 'address.city.name',
			header: 'City',
		},
		{
			accessorKey: 'address.city.countryName',
			header: 'Country',
		},
		{
			accessorKey: 'assets',
			header: 'Image',
			cell: (info) => (
				<img
					src={(info.getValue() as Array<{ url: string }>)[0].url as string}
					alt={info.row.original.name}
					className="aspect-video h-16 object-cover"
				/>
			),
		},
	])
	.addOptions({
		one: () => orpc.places.get,
		list: () => orpc.places.list,
		create: () => {
			throw new Error('Not implemented');
		},
		update: () => orpc.places.update,
		delete: () => orpc.places.delete,
	})
	.addHooks({
		useOne: (input) => {
			return useQuery(
				orpc.places.get.queryOptions({ input: { id: input.id } }),
			);
		},

		useList: (_input) => {
			return useQuery(orpc.places.list.queryOptions({ input: {} }));
		},

		useCreate: () => {
			throw new Error('Not implemented');
		},

		useUpdate: () => {
			return useMutation(orpc.places.update.mutationOptions());
		},

		useDelete: () => {
			return useMutation(orpc.places.delete.mutationOptions());
		},
	})
	.build();
