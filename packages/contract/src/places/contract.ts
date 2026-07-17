import { oc } from '@orpc/contract';
import { ERRORS } from '../_common/errors';
import { dto } from './dto';

export const contract = oc
	.tag('Places')
	.errors(ERRORS)
	.router({
		get: oc.input(dto.getInput).output(dto.getOutput).route({
			path: '/places/:id',
			method: 'GET',
			description: 'Get a place by ID',
			summary: 'Get a place by ID',
		}),
		list: oc.input(dto.listInput).output(dto.listOutput).route({
			path: '/places/peek',
			method: 'GET',
			description: 'Peek Places',
			summary: 'Peek Places',
		}),
		update: oc.input(dto.updateInput).output(dto.updateOutput).route({
			path: '/places/:id/info',
			method: 'PATCH',
			description: 'Update Place Information',
			summary: 'Update Place Information',
		}),
		delete: oc.input(dto.deleteInput).output(dto.deleteOutput).route({
			path: '/places/:id',
			method: 'DELETE',
			description: 'Delete a place',
			summary: 'Delete a place',
			successStatus: 204,
			successDescription: 'No Content',
		}),
	});

export type Contract = typeof contract;
