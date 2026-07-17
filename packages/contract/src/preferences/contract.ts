import { oc } from '@orpc/contract';
import { ERRORS } from '../_common/errors';
import { dto } from './dto';

export const contract = oc
	.tag('Preferences')
	.errors(ERRORS)
	.router({
		get: oc.input(dto.getInput).output(dto.getOutput).route({
			method: 'GET',
			path: '/preferences',
			summary: 'Get Preferences',
			description: 'Get user preferences',
		}),
		update: oc.input(dto.updateInput).output(dto.updateOutput).route({
			method: 'PATCH',
			path: '/preferences',
			summary: 'Update Preferences',
			description: 'Update user preferences',
		}),
	});

export type Contract = typeof contract;
