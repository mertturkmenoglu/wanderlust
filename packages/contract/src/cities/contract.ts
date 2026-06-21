import { oc } from '@orpc/contract';
import * as dto from './dto';

export const contract = {
	list: oc
		.input(dto.listInput)
		.output(dto.listOutput)
		.errors({
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/cities',
			method: 'GET',
			description: 'List all cities',
			summary: 'List all cities',
			tags: ['Cities'],
		}),
	listFeatured: oc
		.input(dto.listFeaturedInput)
		.output(dto.listFeaturedOutput)
		.errors({
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/cities/featured',
			method: 'GET',
			description: 'List all featured cities',
			summary: 'List all featured cities',
			tags: ['Cities'],
		}),
	get: oc
		.input(dto.getInput)
		.output(dto.getOutput)
		.errors({
			BAD_REQUEST: {},
			NOT_FOUND: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/cities/:id',
			method: 'GET',
			description: 'Get a city by ID',
			summary: 'Get a city by ID',
			tags: ['Cities'],
		}),
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
			path: '/cities',
			method: 'POST',
			description: 'Create a new city',
			summary: 'Create a new city',
			tags: ['Cities'],
			successStatus: 201,
			successDescription: 'Created',
		}),
	update: oc
		.input(dto.updateInput)
		.output(dto.updateOutput)
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
			path: '/cities/:id',
			method: 'PATCH',
			description: 'Update an existing city',
			summary: 'Update an existing city',
			tags: ['Cities'],
			successStatus: 200,
			successDescription: 'Updated',
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
			path: '/cities/:id',
			method: 'DELETE',
			description: 'Delete an existing city',
			summary: 'Delete an existing city',
			tags: ['Cities'],
			successStatus: 204,
			successDescription: 'No Content',
		}),
};

export type Contract = typeof contract;
