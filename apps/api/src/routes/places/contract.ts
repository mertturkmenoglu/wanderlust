import { oc } from '@orpc/contract';
import * as dto from './dto';

export const contract = {
	get: oc
		.input(dto.getInput)
		.output(dto.getOutput)
		.errors({
			BAD_REQUEST: {},
			NOT_FOUND: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/places/:id',
			method: 'GET',
			description: 'Get a place by ID',
			summary: 'Get a place by ID',
			tags: ['Places'],
		}),
	peek: oc
		.input(dto.peekInput)
		.output(dto.peekOutput)
		.errors({
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/places/peek',
			method: 'GET',
			description: 'Peek Places',
			summary: 'Peek Places',
			tags: ['Places'],
		}),
	update: oc
		.input(dto.updateInput)
		.output(dto.updateOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/places/:id/info',
			method: 'PATCH',
			description: 'Update Place Information',
			summary: 'Update Place Information',
			tags: ['Places'],
			successStatus: 200,
			successDescription: 'Updated',
		}),
	updateAddress: oc
		.input(dto.updateAddressInput)
		.output(dto.updateAddressOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/places/:id/address',
			method: 'PATCH',
			description: 'Update Place Address',
			summary: 'Update Place Address',
			tags: ['Places'],
			successStatus: 200,
			successDescription: 'Updated',
		}),
	updateAmenities: oc
		.input(dto.updateAmenitiesInput)
		.output(dto.updateAmenitiesOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/places/:id/amenities',
			method: 'PATCH',
			description: 'Update Place Amenities',
			summary: 'Update Place Amenities',
			tags: ['Places'],
			successStatus: 200,
			successDescription: 'Updated',
		}),
	updateHours: oc
		.input(dto.updateHoursInput)
		.output(dto.updateHoursOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/places/:id/hours',
			method: 'PATCH',
			description: 'Update Place Hours',
			summary: 'Update Place Hours',
			tags: ['Places'],
			successStatus: 200,
			successDescription: 'Updated',
		}),
	delete: oc
		.input(dto.deleteInput)
		.output(dto.deleteOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/places/:id',
			method: 'DELETE',
			description: 'Delete a place',
			summary: 'Delete a place',
			tags: ['Places'],
			successStatus: 204,
			successDescription: 'No Content',
		}),
	searchAddresses: oc
		.input(dto.searchAddressesInput)
		.output(dto.searchAddressesOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			path: '/places/search/addresses',
			method: 'GET',
			description: 'Search Place Addresses',
			summary: 'Search Place Addresses',
			tags: ['Places'],
		}),
};
