import { oc } from '@orpc/contract';
import * as dto from './dto';

export const contract = {
	get: oc
		.input(dto.getInput)
		.output(dto.getOutput)
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
			method: 'GET',
			path: '/reviews/:id',
			summary: 'Get Review by ID',
			description: 'Get a review',
			tags: ['Reviews'],
			successStatus: 200,
			successDescription: 'OK',
		}),
	create: oc
		.input(dto.createInput)
		.output(dto.createOutput)
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
			method: 'POST',
			path: '/reviews',
			summary: 'Create Review',
			description: 'Create a new review',
			tags: ['Reviews'],
			successStatus: 201,
			successDescription: 'Created',
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
			method: 'DELETE',
			path: '/reviews/:id',
			summary: 'Delete Review by ID',
			description: 'Delete a review',
			tags: ['Reviews'],
			successStatus: 200,
			successDescription: 'OK',
		}),
	listByUsername: oc
		.input(dto.listByUsernameInput)
		.output(dto.listByUsernameOutput)
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
			method: 'GET',
			path: '/reviews/user/:username',
			summary: 'List Reviews by Username',
			description: 'Get a list of reviews by a specific user',
			tags: ['Reviews'],
			successStatus: 200,
			successDescription: 'OK',
		}),
	listByPlaceId: oc
		.input(dto.listByPlaceIdInput)
		.output(dto.listByPlaceIdOutput)
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
			method: 'GET',
			path: '/reviews/place/:id',
			summary: 'List Reviews by Place ID',
			description: 'Get a list of reviews for a specific place',
			tags: ['Reviews'],
			successStatus: 200,
			successDescription: 'OK',
		}),
	getRatings: oc
		.input(dto.getRatingsInput)
		.output(dto.getRatingsOutput)
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
			method: 'GET',
			path: '/reviews/ratings/place/:id',
			summary: 'Get Ratings by Place ID',
			description: 'Get the ratings for a specific place',
			tags: ['Reviews'],
			successStatus: 200,
			successDescription: 'OK',
		}),
	listAssetsByPlaceId: oc
		.input(dto.listAssetsByPlaceIdInput)
		.output(dto.listAssetsByPlaceIdOutput)
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
			method: 'GET',
			path: '/reviews/assets/place/:id',
			summary: 'List Assets by Place ID',
			description: 'Get a list of assets for a specific place',
			tags: ['Reviews'],
			successStatus: 200,
			successDescription: 'OK',
		}),
};

export type Contract = typeof contract;
