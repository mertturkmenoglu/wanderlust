import { oc } from '@orpc/contract';
import { ERRORS } from '../_common/errors';
import { dto } from './dto';

export const contract = oc
	.tag('Bookmarks')
	.errors(ERRORS)
	.router({
		create: oc.input(dto.createInput).output(dto.createOutput).route({
			path: '/bookmarks',
			method: 'POST',
			description: 'Create a new bookmark',
			summary: 'Create a new bookmark',
			successStatus: 201,
			successDescription: 'Created',
		}),
		delete: oc.input(dto.deleteInput).output(dto.deleteOutput).route({
			path: '/bookmarks/:placeId',
			method: 'DELETE',
			description: 'Delete an existing bookmark',
			summary: 'Delete an existing bookmark',
			successStatus: 204,
			successDescription: 'Deleted',
		}),
		list: oc.input(dto.listInput).output(dto.listOutput).route({
			path: '/bookmarks',
			method: 'GET',
			description: 'List Bookmarks',
			summary: 'List bookmarks for the current user',
		}),
	});

export type Contract = typeof contract;
