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
			path: '/addresses',
			method: 'POST',
			description: 'Create a new address',
			summary: 'Create a new address',
			tags: ['Addresses'],
			successStatus: 201,
			successDescription: 'Created',
		}),
	get: oc
		.input(dto.getInput)
		.output(dto.getOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/addresses/:id',
			method: 'GET',
			description: 'Get an address by ID',
			summary: 'Get an address by ID',
			tags: ['Addresses'],
			successStatus: 200,
			successDescription: 'OK',
		}),
	update: oc
		.input(dto.updateInput)
		.output(dto.updateOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/addresses/:id',
			method: 'PATCH',
			description: 'Update an address by ID',
			summary: 'Update an address by ID',
			tags: ['Addresses'],
			successStatus: 200,
			successDescription: 'OK',
		}),
	delete: oc
		.input(dto.deleteInput)
		.output(dto.deleteOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/addresses/:id',
			method: 'DELETE',
			description: 'Delete an address by ID',
			summary: 'Delete an address by ID',
			tags: ['Addresses'],
			successStatus: 204,
			successDescription: 'No Content',
		}),
	list: oc
		.input(dto.listInput)
		.output(dto.listOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/addresses',
			method: 'GET',
			description: 'List all addresses',
			summary: 'List all addresses',
			tags: ['Addresses'],
			successStatus: 200,
			successDescription: 'OK',
		}),
};

export type Contract = typeof contract;
