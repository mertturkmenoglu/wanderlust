import { oc } from '@orpc/contract';
import * as dto from './dto';

export const contract = {
	home: oc
		.input(dto.homeInput)
		.output(dto.homeOutput)
		.errors({
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'GET',
			path: '/aggregator/home',
			summary: 'Get Home Aggregated Data',
			description: 'Get aggregated data for home page',
			tags: ['Aggregator'],
		}),
};

export type Contract = typeof contract;
