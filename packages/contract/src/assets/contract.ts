import { oc } from '@orpc/contract';
import { ERRORS } from '../_common/errors';
import { dto } from './dto';

export const contract = oc
	.errors(ERRORS)
	.tag('Assets')
	.router({
		create: oc.input(dto.createInput).output(dto.createOutput).route({
			path: '/assets',
			method: 'POST',
			description: 'Create a new asset',
			summary: 'Create a new asset',
			successStatus: 201,
			successDescription: 'Created',
		}),
		createMany: oc
			.input(dto.createManyInput)
			.output(dto.createManyOutput)
			.route({
				path: '/assets/bulk',
				method: 'POST',
				description: 'Create multiple assets',
				summary: 'Create multiple assets',
				successStatus: 201,
				successDescription: 'Created',
			}),
	});
