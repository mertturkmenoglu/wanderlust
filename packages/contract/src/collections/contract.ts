import { oc } from '@orpc/contract';
import { ERRORS } from '../_common/errors';
import { dto } from './dto';

export const contract = oc
	.errors(ERRORS)
	.tag('Collections')
	.router({
		get: oc.input(dto.getInput).output(dto.getOutput).route({
			method: 'GET',
			path: '/collections/:id',
			summary: 'Get a collection by ID',
			description: 'Get a collection by its ID, including its items',
		}),
		list: oc.input(dto.listInput).output(dto.listOutput).route({
			method: 'GET',
			path: '/collections',
			summary: 'List collections',
			description:
				'List collections with optional pagination, filtering, and sorting',
		}),
		create: oc.input(dto.createInput).output(dto.createOutput).route({
			method: 'POST',
			path: '/collections',
			summary: 'Create a new collection',
			description: 'Create a new collection with the specified details',
		}),
		update: oc.input(dto.updateInput).output(dto.updateOutput).route({
			method: 'PATCH',
			path: '/collections/:id',
			summary: 'Update a collection by ID',
			description: 'Update the details of an existing collection by its ID',
		}),
		delete: oc.input(dto.deleteInput).output(dto.deleteOutput).route({
			method: 'DELETE',
			path: '/collections/:id',
			summary: 'Delete a collection by ID',
			description:
				'Delete an existing collection by its ID. This also removes all associated items and relations.',
		}),
		items: {
			update: oc
				.input(dto.itemsUpdateInput)
				.output(dto.itemsUpdateOutput)
				.route({
					method: 'PATCH',
					path: '/collections/:id/items',
					summary: 'Update items in a collection',
					description:
						'Update one or more place items in a collection by its ID',
				}),
		},
		places: {
			list: oc.input(dto.placesListInput).output(dto.placesListOutput).route({
				method: 'GET',
				path: '/collections/places/:placeId',
				summary: 'List collections for a place',
				description:
					'List collections that are featured on a specific place by its place id. Answers the question: "Which collections are featured on this place?"',
			}),
			update: oc
				.input(dto.placesUpdateInput)
				.output(dto.placesUpdateOutput)
				.route({
					method: 'PATCH',
					path: '/collections/places/:placeId',
					summary: 'Update collections for a place',
					description:
						'Update collections that are featured on a specific place by its place id',
				}),
		},
		cities: {
			list: oc.input(dto.citiesListInput).output(dto.citiesListOutput).route({
				method: 'GET',
				path: '/collections/cities/:cityId',
				summary: 'List collections for a city',
				description:
					'List collections that are featured in a specific city by its city id. Answers the question: "Which collections are featured in this city?"',
			}),
			update: oc
				.input(dto.citiesUpdateInput)
				.output(dto.citiesUpdateOutput)
				.route({
					method: 'PATCH',
					path: '/collections/cities/:cityId',
					summary: 'Update collections for a city',
					description:
						'Update collections that are featured in a specific city by its city id',
				}),
		},
		relations: {
			places: oc
				.input(dto.relationsPlacesInput)
				.output(dto.relationsPlacesOutput)
				.route({
					method: 'GET',
					path: '/collections/:id/relations/places',
					summary: 'Get places related to a collection',
					description:
						'Get all places that are related to a specific collection by its ID. Answers the question: "Which places features this collection?"',
				}),
			cities: oc
				.input(dto.relationsCitiesInput)
				.output(dto.relationsCitiesOutput)
				.route({
					method: 'GET',
					path: '/collections/:id/relations/cities',
					summary: 'Get cities related to a collection',
					description:
						'Get all cities that are related to a specific collection by its ID. Answers the question: "Which cities features this collection?"',
				}),
		},
	});

export type Contract = typeof contract;
