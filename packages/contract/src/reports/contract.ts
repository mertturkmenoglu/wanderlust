import { oc } from '@orpc/contract';
import { ERRORS } from '../_common/errors';
import { dto } from './dto';

export const contract = oc
	.tag('Reports')
	.errors(ERRORS)
	.router({
		get: oc.input(dto.getInput).output(dto.getOutput).route({
			method: 'GET',
			path: '/reports/:id',
			summary: 'Get Report',
			description: 'Retrieve a specific report by its ID.',
		}),
		list: oc.input(dto.listInput).output(dto.listOutput).route({
			method: 'GET',
			path: '/reports',
			summary: 'List Reports',
			description: 'Retrieve a list of reports.',
		}),
		search: oc.input(dto.searchInput).output(dto.searchOutput).route({
			method: 'GET',
			path: '/reports/search',
			summary: 'Search Reports',
			description: 'Search for reports based on query parameters.',
		}),
		create: oc.input(dto.createInput).output(dto.createOutput).route({
			method: 'POST',
			path: '/reports',
			summary: 'Create Report',
			description: 'Create a new report.',
			successStatus: 201,
			successDescription: 'Created',
		}),
		update: oc.input(dto.updateInput).output(dto.updateOutput).route({
			method: 'PATCH',
			path: '/reports/:id',
			summary: 'Update Report',
			description: 'Update an existing report.',
		}),
		delete: oc.input(dto.deleteInput).output(dto.deleteOutput).route({
			method: 'DELETE',
			path: '/reports/:id',
			summary: 'Delete Report',
			description: 'Delete a specific report by its ID.',
			successStatus: 204,
			successDescription: 'No Content',
		}),
	});

export type Contract = typeof contract;
