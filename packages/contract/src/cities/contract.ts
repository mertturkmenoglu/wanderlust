import { oc } from '@orpc/contract';
import { ERRORS } from '../_common/errors';
import { dto } from './dto';

export const contract = oc
	.tag('Cities')
	.errors(ERRORS)
	.router({
		list: oc.input(dto.listInput).output(dto.listOutput).route({
			path: '/cities',
			method: 'GET',
			description: 'List all cities',
			summary: 'List all cities',
		}),
		listFeatured: oc
			.input(dto.listFeaturedInput)
			.output(dto.listFeaturedOutput)
			.route({
				path: '/cities/featured',
				method: 'GET',
				description: 'List all featured cities',
				summary: 'List all featured cities',
			}),
		get: oc.input(dto.getInput).output(dto.getOutput).route({
			path: '/cities/:id',
			method: 'GET',
			description: 'Get a city by ID',
			summary: 'Get a city by ID',
		}),
		create: oc.input(dto.createInput).output(dto.createOutput).route({
			path: '/cities',
			method: 'POST',
			description: 'Create a new city',
			summary: 'Create a new city',
			successStatus: 201,
			successDescription: 'Created',
		}),
		update: oc.input(dto.updateInput).output(dto.updateOutput).route({
			path: '/cities/:id',
			method: 'PATCH',
			description: 'Update an existing city',
			summary: 'Update an existing city',
		}),
		delete: oc.input(dto.deleteInput).output(dto.deleteOutput).route({
			path: '/cities/:id',
			method: 'DELETE',
			description: 'Delete an existing city',
			summary: 'Delete an existing city',
			successStatus: 204,
			successDescription: 'No Content',
		}),
	});

export type Contract = typeof contract;
