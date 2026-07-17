import { oc } from '@orpc/contract';
import { ERRORS } from '../_common/errors';
import { dto } from './dto';

export const contract = oc
	.errors(ERRORS)
	.tag('Lists')
	.router({
		list: oc.input(dto.listInput).output(dto.listOutput).route({
			path: '/lists',
			method: 'GET',
			summary: 'Retrieve All Lists',
			description: 'Retrieve all lists for the authenticated user.',
		}),
		listPublic: oc
			.input(dto.listPublicInput)
			.output(dto.listPublicOutput)
			.route({
				path: '/lists/user/:username',
				method: 'GET',
				summary: 'List Public Lists of a User',
				description: 'Retrieve all public lists of a specified user.',
			}),
		get: oc.input(dto.getInput).output(dto.getOutput).route({
			path: '/lists/:id',
			method: 'GET',
			summary: 'Get a List',
			description: 'Retrieve a specific list by its ID.',
		}),
		listPlaceSaveStat: oc
			.input(dto.listPlaceSaveStatInput)
			.output(dto.listPlaceSaveStatOutput)
			.route({
				path: '/lists/stat/:placeId',
				method: 'GET',
				summary: 'List Place Save Status',
				description:
					'Retrieve the save status of a specific place across all lists for the authenticated user.',
			}),
		create: oc.input(dto.createInput).output(dto.createOutput).route({
			path: '/lists',
			method: 'POST',
			summary: 'Create a List',
			description: 'Create a new list.',
			successStatus: 201,
			successDescription: 'Created',
		}),
		update: oc.input(dto.updateInput).output(dto.updateOutput).route({
			path: '/lists/:id',
			method: 'PATCH',
			summary: 'Update a List',
			description: 'Update an existing list.',
		}),
		delete: oc.input(dto.deleteInput).output(dto.deleteOutput).route({
			path: '/lists/:id',
			method: 'DELETE',
			summary: 'Delete a List',
			description: 'Delete a specific list by its ID.',
			successStatus: 204,
			successDescription: 'No Content',
		}),
		items: {
			update: oc
				.input(dto.itemsUpdateInput)
				.output(dto.itemsUpdateOutput)
				.route({
					path: '/lists/:id/items',
					method: 'PATCH',
					summary: 'Update Items in a List',
					description: 'Update items in a specific list.',
				}),
		},
	});

export type Contract = typeof contract;
