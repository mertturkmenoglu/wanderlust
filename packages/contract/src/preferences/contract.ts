import { oc } from '@orpc/contract';
import * as dto from './dto';

export const contract = {
	get: oc.input(dto.getInput)
		.output(dto.getOutput)
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
			method: 'GET',
			path: '/preferences',
			summary: 'Get Preferences',
			description: 'Get user preferences',
			tags: ['Preferences'],
			successStatus: 200,
			successDescription: 'OK',
		}),
	update: oc.input(dto.updateInput)
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
			method: 'PATCH',
			path: '/preferences',
			summary: 'Update Preferences',
			description: 'Update user preferences',
			tags: ['Preferences'],
			successStatus: 200,
			successDescription: 'OK',
		}),
};

export type Contract = typeof contract;
