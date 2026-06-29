export const template = `
import { oc } from '@orpc/contract';
import * as dto from './dto';

export const contract = {
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
			path: '/{{feature}}',
			method: 'GET',
			description: 'Get {{feature}}',
			summary: 'Get {{feature}}',
			tags: ['{{Feature}}'],
			successStatus: 200,
			successDescription: 'OK',
		}),
};

export type Contract = typeof contract;
`;
