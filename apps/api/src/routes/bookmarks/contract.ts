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
			path: '/bookmarks',
			method: 'POST',
			description: 'Create a new bookmark',
			summary: 'Create a new bookmark',
			tags: ['Bookmarks'],
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
			path: '/bookmarks/:placeId',
			method: 'DELETE',
			description: 'Delete an existing bookmark',
			summary: 'Delete an existing bookmark',
			tags: ['Bookmarks'],
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
			path: '/bookmarks',
			method: 'GET',
			description: 'List Bookmarks',
			summary: 'List bookmarks for the current user',
			tags: ['Bookmarks'],
			successStatus: 200,
			successDescription: 'OK',
		}),
};
