import { oc } from '@orpc/contract';
import { ERRORS } from '../_common/errors';
import * as dto from './dto';

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
			append: oc
				.input(dto.itemsAppendInput)
				.output(dto.itemsAppendOutput)
				.route({
					method: 'POST',
					path: '/collections/:id/items',
					summary: 'Append items to a collection',
					description: 'Append one place item to a collection by its ID',
				}),
			remove: oc
				.input(dto.itemsRemoveInput)
				.output(dto.itemsRemoveOutput)
				.route({
					method: 'DELETE',
					path: '/collections/:id/items',
					summary: 'Remove an item from a collection',
					description: 'Remove one place item from a collection by its ID',
				}),
			reorder: oc
				.input(dto.itemsReorderInput)
				.output(dto.itemsReorderOutput)
				.route({
					method: 'PATCH',
					path: '/collections/:id/items',
					summary: 'Reorder items in a collection',
					description:
						'Reorder items in a collection by providing a new order of place IDs',
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
			append: oc
				.input(dto.placesAppendInput)
				.output(dto.placesAppendOutput)
				.route({
					method: 'POST',
					path: '/collections/places/:placeId',
					summary: 'Append a collection to a place',
					description:
						'Append a collection to a specific place by its place id',
				}),
			reorder: oc
				.input(dto.placesReorderInput)
				.output(dto.placesReorderOutput)
				.route({
					method: 'PATCH',
					path: '/collections/places/:placeId',
					summary: 'Reorder collections for a place',
					description:
						'Reorder collections for a specific place by its place id',
				}),
			remove: oc
				.input(dto.placesRemoveInput)
				.output(dto.placesRemoveOutput)
				.route({
					method: 'DELETE',
					path: '/collections/places/:placeId',
					summary: 'Remove a collection from a place',
					description:
						'Remove a collection from a specific place by its place id',
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
			append: oc
				.input(dto.citiesAppendInput)
				.output(dto.citiesAppendOutput)
				.route({
					method: 'POST',
					path: '/collections/cities/:cityId',
					summary: 'Append a collection to a city',
					description: 'Append a collection to a specific city by its city id',
				}),
			reorder: oc
				.input(dto.citiesReorderInput)
				.output(dto.citiesReorderOutput)
				.route({
					method: 'PATCH',
					path: '/collections/cities/:cityId',
					summary: 'Reorder collections for a city',
					description: 'Reorder collections for a specific city by its city id',
				}),
			remove: oc
				.input(dto.citiesRemoveInput)
				.output(dto.citiesRemoveOutput)
				.route({
					method: 'DELETE',
					path: '/collections/cities/:cityId',
					summary: 'Remove a collection from a city',
					description:
						'Remove a collection from a specific city by its city id',
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
