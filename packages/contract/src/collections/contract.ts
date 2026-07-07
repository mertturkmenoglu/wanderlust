import { oc } from '@orpc/contract';
import { ERRORS } from '../_common/errors';
import * as dto from './dto';

export const contract = oc
	.errors(ERRORS)
	.tag('Collections')
	.router({
		list: oc.input(dto.listInput).output(dto.listOutput).route({
			method: 'GET',
			path: '/collections',
			summary: 'List Collections',
			description: 'Retrieve a list of collections with pagination support.',
		}),
		get: oc.input(dto.getInput).output(dto.getOutput).route({
			method: 'GET',
			path: '/collections/:id',
			summary: 'Get Collection',
			description: 'Retrieve a specific collection by its ID.',
		}),
		create: oc.input(dto.createInput).output(dto.createOutput).route({
			method: 'POST',
			path: '/collections',
			summary: 'Create Collection',
			description: 'Create a new collection.',
		}),
		delete: oc.input(dto.deleteInput).output(dto.deleteOutput).route({
			method: 'DELETE',
			path: '/collections/:id',
			summary: 'Delete Collection',
			description: 'Delete a specific collection by its ID.',
		}),
		update: oc.input(dto.updateInput).output(dto.updateOutput).route({
			method: 'PATCH',
			path: '/collections/:id',
			summary: 'Update Collection',
			description: 'Update a specific collection by its ID.',
		}),
		items: {
			append: oc.input(dto.appendItemInput).output(dto.appendItemOutput).route({
				method: 'POST',
				path: '/collections/:id/items',
				summary: 'Append Item to Collection',
				description: 'Append an item to a specific collection by its ID.',
			}),
			remove: oc.input(dto.removeItemInput).output(dto.removeItemOutput).route({
				method: 'DELETE',
				path: '/collections/:id/items/:placeId',
				summary: 'Remove Item from Collection',
				description: 'Remove an item from a specific collection by its ID.',
			}),
			reorder: oc
				.input(dto.reorderItemsInput)
				.output(dto.reorderItemsOutput)
				.route({
					method: 'PATCH',
					path: '/collections/:id/items',
					summary: 'Reorder Items in Collection',
					description: 'Reorder items in a specific collection by its ID.',
				}),
		},
		relations: {
			places: {
				get: oc
					.input(dto.getCollectionPlaceRelationInput)
					.output(dto.getCollectionPlaceRelationOutput)
					.route({
						method: 'GET',
						path: '/collections/:collectionId/relations/places/:placeId',
						summary: 'Get Collection-Place Relation',
						description:
							'Retrieve a specific relation between a collection and a place.',
					}),
				list: oc
					.input(dto.listCollectionPlaceRelationsInput)
					.output(dto.listCollectionPlaceRelationsOutput)
					.route({
						method: 'GET',
						path: '/collections/:collectionId/relations/places',
						summary: 'List Collection-Place Relations',
						description:
							'Retrieve all places related to a specific collection.',
					}),
				create: oc
					.input(dto.createCollectionPlaceRelationInput)
					.output(dto.createCollectionPlaceRelationOutput)
					.route({
						method: 'POST',
						path: '/collections/:collectionId/relations/places/:placeId',
						summary: 'Create Collection-Place Relation',
						description: 'Create a relation between a collection and a place.',
					}),
				delete: oc
					.input(dto.deleteCollectionPlaceRelationInput)
					.output(dto.deleteCollectionPlaceRelationOutput)
					.route({
						method: 'DELETE',
						path: '/collections/:collectionId/relations/places/:placeId',
						summary: 'Delete Collection-Place Relation',
						description: 'Delete a relation between a collection and a place.',
					}),
			},
			cities: {
				get: oc
					.input(dto.getCollectionCityRelationInput)
					.output(dto.getCollectionCityRelationOutput)
					.route({
						method: 'GET',
						path: '/collections/:collectionId/relations/cities/:cityId',
						summary: 'Get Collection-City Relation',
						description:
							'Retrieve a specific relation between a collection and a city.',
					}),
				list: oc
					.input(dto.listCollectionCityRelationsInput)
					.output(dto.listCollectionCityRelationsOutput)
					.route({
						method: 'GET',
						path: '/collections/:collectionId/relations/cities',
						summary: 'List Collection-City Relations',
						description:
							'Retrieve all cities related to a specific collection.',
					}),
				create: oc
					.input(dto.createCollectionCityRelationInput)
					.output(dto.createCollectionCityRelationOutput)
					.route({
						method: 'POST',
						path: '/collections/:collectionId/relations/cities/:cityId',
						summary: 'Create Collection-City Relation',
						description: 'Create a relation between a collection and a city.',
					}),
				delete: oc
					.input(dto.deleteCollectionCityRelationInput)
					.output(dto.deleteCollectionCityRelationOutput)
					.route({
						method: 'DELETE',
						path: '/collections/:collectionId/relations/cities/:cityId',
						summary: 'Delete Collection-City Relation',
						description: 'Delete a relation between a collection and a city.',
					}),
			},
		},
		listBy: {
			place: oc
				.input(dto.listByPlaceInput)
				.output(dto.listByPlaceOutput)
				.route({
					method: 'GET',
					path: '/collections/list-by-place/:placeId',
					summary: 'List Collections by Place',
					description: 'List all collections associated with a specific place.',
				}),
			city: oc.input(dto.listByCityInput).output(dto.listByCityOutput).route({
				method: 'GET',
				path: '/collections/list-by-city/:cityId',
				summary: 'List Collections by City',
				description: 'List all collections associated with a specific city.',
			}),
		},
	});

export type Contract = typeof contract;
