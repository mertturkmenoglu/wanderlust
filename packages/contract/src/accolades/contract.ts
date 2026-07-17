import { oc } from '@orpc/contract';
import { ERRORS } from '../_common/errors';
import { dto } from './dto';

export const contract = oc
	.errors(ERRORS)
	.tag('Accolades')
	.router({
		create: oc.input(dto.createInput).output(dto.createOutput).route({
			path: '/accolades',
			method: 'POST',
			description: 'Create a new accolade',
			summary: 'Create a new accolade',
			successStatus: 201,
			successDescription: 'Created',
		}),
		get: oc.input(dto.getInput).output(dto.getOutput).route({
			path: '/accolades/:id',
			method: 'GET',
			description: 'Get an accolade by ID',
			summary: 'Get an accolade by ID',
		}),
		update: oc.input(dto.updateInput).output(dto.updateOutput).route({
			path: '/accolades/:id',
			method: 'PATCH',
			description: 'Update an accolade by ID',
			summary: 'Update an accolade by ID',
		}),
		delete: oc
			.input(dto.deleteInput)
			.output(dto.deleteOutput)
			.route({
				path: '/accolades/:id',
				method: 'DELETE',
				description: 'Delete an accolade by ID',
				summary: 'Delete an accolade by ID',
				tags: ['Accolades'],
				successStatus: 204,
				successDescription: 'No Content',
			}),
		listPlaces: oc
			.input(dto.listPlacesInput)
			.output(dto.listPlacesOutput)
			.route({
				path: '/accolades/:id/places',
				method: 'GET',
				description: 'List places for an accolade by ID',
				summary: 'Retrieve places for an accolade by ID',
			}),
		list: oc.input(dto.listInput).output(dto.listOutput).route({
			path: '/accolades',
			method: 'GET',
			description: 'List all accolades',
			summary: 'List all accolades',
		}),
	});
