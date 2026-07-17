import { oc } from '@orpc/contract';
import { ERRORS } from '../_common/errors';
import { dto } from './dto';

export const contract = oc
	.tag('Favorites')
	.errors(ERRORS)
	.router({
		create: oc.input(dto.createInput).output(dto.createOutput).route({
			path: '/favorites',
			method: 'POST',
			description: 'Create a new favorite',
			summary: 'Create a new favorite',
			successStatus: 201,
			successDescription: 'Created',
		}),
		delete: oc.input(dto.deleteInput).output(dto.deleteOutput).route({
			path: '/favorites/:placeId',
			method: 'DELETE',
			description: 'Delete an existing favorite',
			summary: 'Delete an existing favorite',
			successStatus: 204,
			successDescription: 'Deleted',
		}),
		list: oc.input(dto.listInput).output(dto.listOutput).route({
			path: '/favorites',
			method: 'GET',
			description: 'List Favorites',
			summary: 'List favorites for the current user',
		}),
		listByUsername: oc
			.input(dto.listByUsernameInput)
			.output(dto.listByUsernameOutput)
			.route({
				path: '/favorites/user/:username',
				method: 'GET',
				description: 'List favorites for a given username',
				summary: 'List Favorites By Username',
			}),
	});

export type Contract = typeof contract;
