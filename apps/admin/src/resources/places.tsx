import { useMutation, useQuery } from '@tanstack/react-query';
import { type DataResource, defineResource, getDefaultLinks } from '@/lib/crud';
import { appLink } from '@/lib/link';
import { type Outputs, orpc } from '@/lib/orpc';

type Place = Outputs['places']['get']['place'];

export const placesResource: DataResource<'places', Place> = defineResource({
	resource: 'places',
	breadcrumb: 'Places',

	links: getDefaultLinks('places'),

	extractors: {
		id: (data) => data.id,
		one: (data) => data.place,
		list: (data) => data.places,
		title: (data) => data.name,
		description: (data) => data.description,
		appLink: (data) => appLink(`/p/${data.id}`),
	},

	useOne: (input) => {
		return useQuery(orpc.places.get.queryOptions({ input: { id: input.id } }));
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
});
