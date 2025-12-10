import { oc } from '@orpc/contract';
import * as dto from './dto';

export const contract = {
	list: oc
		.input(dto.listInput)
		.output(dto.listOutput)
		.errors({})
		.route({
			path: '/amenities',
			method: 'GET',
			description: 'Get list of amenities',
			summary: 'Get list of amenities',
			tags: ['Amenities'],
		}),
};
