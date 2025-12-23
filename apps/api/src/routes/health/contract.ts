import { oc } from '@orpc/contract';
import * as dto from './dto';

export const contract = {
	check: oc
		.input(dto.checkInput)
		.output(dto.checkOutput)
		.errors({})
		.route({
			path: '/health',
			method: 'GET',
			description: 'Check the health status of the API',
			summary: 'Check Server Status',
			tags: ['Health'],
		}),
};
