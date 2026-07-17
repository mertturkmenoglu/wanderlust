import { oc } from '@orpc/contract';
import { ERRORS } from '../_common/errors';
import { dto } from './dto';

export const contract = oc
	.tag('Reviews')
	.errors(ERRORS)
	.router({
		get: oc.input(dto.getInput).output(dto.getOutput).route({
			method: 'GET',
			path: '/reviews/:id',
			summary: 'Get Review by ID',
			description: 'Get a review',
		}),
		create: oc.input(dto.createInput).output(dto.createOutput).route({
			method: 'POST',
			path: '/reviews',
			summary: 'Create Review',
			description: 'Create a new review',
			successStatus: 201,
			successDescription: 'Created',
		}),
		delete: oc.input(dto.deleteInput).output(dto.deleteOutput).route({
			method: 'DELETE',
			path: '/reviews/:id',
			summary: 'Delete Review by ID',
			description: 'Delete a review',
			successStatus: 204,
			successDescription: 'No Content',
		}),
		listByUsername: oc
			.input(dto.listByUsernameInput)
			.output(dto.listByUsernameOutput)
			.route({
				method: 'GET',
				path: '/reviews/user/:username',
				summary: 'List Reviews by Username',
				description: 'Get a list of reviews by a specific user',
			}),
		listByPlaceId: oc
			.input(dto.listByPlaceIdInput)
			.output(dto.listByPlaceIdOutput)
			.route({
				method: 'GET',
				path: '/reviews/place/:id',
				summary: 'List Reviews by Place ID',
				description: 'Get a list of reviews for a specific place',
			}),
		getRatings: oc
			.input(dto.getRatingsInput)
			.output(dto.getRatingsOutput)
			.route({
				method: 'GET',
				path: '/reviews/ratings/place/:id',
				summary: 'Get Ratings by Place ID',
				description: 'Get the ratings for a specific place',
			}),
		listAssetsByPlaceId: oc
			.input(dto.listAssetsByPlaceIdInput)
			.output(dto.listAssetsByPlaceIdOutput)
			.route({
				method: 'GET',
				path: '/reviews/assets/place/:id',
				summary: 'List Assets by Place ID',
				description: 'Get a list of assets for a specific place',
			}),
		like: oc.input(dto.likeInput).output(dto.likeOutput).route({
			method: 'POST',
			path: '/reviews/:id/likes',
			summary: 'Like or Unlike Review by ID',
			description: 'Like or unlike a review',
		}),
		listLikes: oc.input(dto.listLikesInput).output(dto.listLikesOutput).route({
			method: 'GET',
			path: '/reviews/:id/likes',
			summary: 'List Likes by Review ID',
			description: 'List the likes for a specific review',
		}),
	});

export type Contract = typeof contract;
