import { oc } from '@orpc/contract';
import * as dto from './dto';

export const contract = {
	get: oc
		.input(dto.getInput)
		.output(dto.getOutput)
		.errors({
			BAD_REQUEST: {},
			NOT_FOUND: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/places/:id',
			method: 'GET',
			description: 'Get a place by ID',
			summary: 'Get a place by ID',
			tags: ['Places'],
		}),
	list: oc
		.input(dto.listInput)
		.output(dto.listOutput)
		.errors({
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/places/peek',
			method: 'GET',
			description: 'Peek Places',
			summary: 'Peek Places',
			tags: ['Places'],
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
			path: '/places/:id/info',
			method: 'PATCH',
			description: 'Update Place Information',
			summary: 'Update Place Information',
			tags: ['Places'],
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
			path: '/places/:id',
			method: 'DELETE',
			description: 'Delete a place',
			summary: 'Delete a place',
			tags: ['Places'],
			successStatus: 204,
			successDescription: 'No Content',
		}),
	searchAddresses: oc
		.input(dto.searchAddressesInput)
		.output(dto.searchAddressesOutput)
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
			path: '/places/search/addresses',
			method: 'GET',
			description: 'Search Place Addresses',
			summary: 'Search Place Addresses',
			tags: ['Places'],
		}),
};

export type Contract = typeof contract;
