import { oc } from '@orpc/contract';
import * as dto from './dto';

export const contract = {
	create: oc
		.input(dto.createInput)
		.output(dto.createOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/favorites',
			method: 'POST',
			description: 'Create a new favorite',
			summary: 'Create a new favorite',
			tags: ['Favorites'],
			successStatus: 201,
			successDescription: 'Created',
		}),
	delete: oc
		.input(dto.deleteInput)
		.output(dto.deleteOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/favorites/:placeId',
			method: 'DELETE',
			description: 'Delete an existing favorite',
			summary: 'Delete an existing favorite',
			tags: ['Favorites'],
			successStatus: 204,
			successDescription: 'Deleted',
		}),
	list: oc
		.input(dto.listInput)
		.output(dto.listOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/favorites',
			method: 'GET',
			description: 'List Favorites',
			summary: 'List favorites for the current user',
			tags: ['Favorites'],
			successStatus: 200,
			successDescription: 'OK',
		}),
	listByUsername: oc
		.input(dto.listByUsernameInput)
		.output(dto.listByUsernameOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			NOT_FOUND: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/favorites/user/:username',
			method: 'GET',
			description: 'List favorites for a given username',
			summary: 'List Favorites By Username',
			tags: ['Favorites'],
			successStatus: 200,
			successDescription: 'OK',
		}),
};
