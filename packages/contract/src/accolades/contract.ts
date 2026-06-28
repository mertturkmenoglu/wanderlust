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
			path: '/accolades',
			method: 'POST',
			description: 'Create a new accolade',
			summary: 'Create a new accolade',
			tags: ['Accolades'],
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
			path: '/accolades/:id',
			method: 'GET',
			description: 'Get an accolade by ID',
			summary: 'Get an accolade by ID',
			tags: ['Accolades'],
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
			path: '/accolades/:id',
			method: 'PATCH',
			description: 'Update an accolade by ID',
			summary: 'Update an accolade by ID',
			tags: ['Accolades'],
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
			path: '/accolades/:id',
			method: 'DELETE',
			description: 'Delete an accolade by ID',
			summary: 'Delete an accolade by ID',
			tags: ['Accolades'],
			successStatus: 204,
			successDescription: 'No Content',
		}),
	getPlaces: oc
		.input(dto.getPlacesInput)
		.output(dto.getPlacesOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/accolades/:id/places',
			method: 'GET',
			description: 'Get places for an accolade by ID',
			summary: 'Get places for an accolade by ID',
			tags: ['Accolades'],
			successStatus: 200,
			successDescription: 'OK',
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
			path: '/accolades',
			method: 'GET',
			description: 'List all accolades',
			summary: 'List all accolades',
			tags: ['Accolades'],
			successStatus: 200,
			successDescription: 'OK',
		}),
};

export type Contract = typeof contract;
