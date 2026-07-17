import { oc } from '@orpc/contract';
import { dto } from './dto';

export const contract = {
	check: oc
		.input(dto.checkInput)
		.output(dto.checkOutput)
		.route({
			path: '/health',
			method: 'GET',
			description: 'Check the health status of the API',
			summary: 'Check Server Status',
			tags: ['Health'],
		}),
};

export type Contract = typeof contract;
