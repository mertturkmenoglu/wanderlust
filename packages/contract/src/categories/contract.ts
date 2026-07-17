import { oc } from '@orpc/contract';
import { ERRORS } from '../_common/errors';
import { dto } from './dto';

export const contract = oc
	.tag('Categories')
	.errors(ERRORS)
	.router({
		get: oc.input(dto.getInput).output(dto.getOutput).route({
			path: '/categories/:id',
			method: 'GET',
			description: 'Get a category by ID',
			summary: 'Get a category by ID',
		}),
		list: oc.input(dto.listInput).output(dto.listOutput).route({
			path: '/categories',
			method: 'GET',
			description: 'List all categories',
			summary: 'List all categories',
		}),
		create: oc.input(dto.createInput).output(dto.createOutput).route({
			path: '/categories',
			method: 'POST',
			description: 'Create a new category',
			summary: 'Create a new category',
			successStatus: 201,
			successDescription: 'Created',
		}),
		update: oc.input(dto.updateInput).output(dto.updateOutput).route({
			path: '/categories/:id',
			method: 'PATCH',
			description: 'Update an existing category',
			summary: 'Update an existing category',
			successStatus: 200,
			successDescription: 'Updated',
		}),
		delete: oc.input(dto.deleteInput).output(dto.deleteOutput).route({
			path: '/categories/:id',
			method: 'DELETE',
			description: 'Delete an existing category',
			summary: 'Delete an existing category',
			successStatus: 204,
			successDescription: 'No Content',
		}),
	});

export type Contract = typeof contract;
