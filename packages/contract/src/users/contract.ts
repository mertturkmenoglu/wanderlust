import { oc } from '@orpc/contract';
import * as dto from './dto';

export const contract = {
	updateImage: oc
		.input(dto.updateImageInput)
		.output(dto.updateImageOutput)
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
			path: '/users/image',
			summary: 'Update Image',
			description: 'Update the profile image or the banner image of the user',
			successStatus: 201,
			successDescription: 'Created',
			tags: ['Users'],
		}),
	getRole: oc
		.input(dto.getRoleInput)
		.output(dto.getRoleOutput)
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
			path: '/users/me/role',
			summary: 'Get User Role',
			description: 'Retrieve the role of the currently authenticated user',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Users'],
		}),
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
			path: '/users/:username',
			summary: 'Get User Profile',
			description: 'Retrieve the profile of a user by their username',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Users'],
		}),
	getById: oc
		.input(dto.getByIdInput)
		.output(dto.getByIdOutput)
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
			path: '/users/id/:id',
			summary: 'Get User by ID',
			description: 'Retrieve the profile of a user by their ID',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Users'],
		}),
	getMe: oc
		.input(dto.getMeInput)
		.output(dto.getMeOutput)
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
			path: '/users',
			summary: 'Get Current User',
			description: 'Retrieve the profile of the currently authenticated user',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Users'],
		}),
	listFollowers: oc
		.input(dto.listFollowersInput)
		.output(dto.listFollowersOutput)
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
			path: '/users/:username/followers',
			summary: 'List User Followers',
			description: 'Retrieve a list of followers for a user by their username',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Users'],
		}),
	listFollowing: oc
		.input(dto.listFollowingInput)
		.output(dto.listFollowingOutput)
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
			path: '/users/:username/following',
			summary: 'List User Following',
			description: 'Retrieve a list of users followed by a user',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Users'],
		}),
	listTopPlaces: oc
		.input(dto.listTopPlacesInput)
		.output(dto.listTopPlacesOutput)
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
			path: '/users/:username/top-places',
			summary: 'List User Top Places',
			description: 'Retrieve a list of top places of a user',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Users'],
		}),
	updateTopPlaces: oc
		.input(dto.updateTopPlacesInput)
		.output(dto.updateTopPlacesOutput)
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
			method: 'PATCH',
			path: '/users/top-places',
			summary: 'Update User Top Places',
			description: 'Update the list of top places of this user',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Users'],
		}),
	listActivities: oc
		.input(dto.listUserActivitiesInput)
		.output(dto.listUserActivitiesOutput)
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
			path: '/users/:username/activities',
			summary: 'List User Activities',
			description: 'Retrieve a list of activities for a user by their username',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Users'],
		}),
	searchFollowing: oc
		.input(dto.searchFollowingInput)
		.output(dto.searchFollowingOutput)
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
			path: '/users/search/following',
			summary: 'Search User Following',
			description: 'Search for following of this user',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Users'],
		}),
	follow: oc
		.input(dto.followInput)
		.output(dto.followOutput)
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
			path: '/users/:username/follow',
			summary: 'Follow/Unfollow User',
			description: 'Follow or unfollow a user by their username',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Users'],
		}),
	update: oc
		.input(dto.updateInput)
		.output(dto.updateOutput)
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
			method: 'PATCH',
			path: '/users/:username',
			summary: 'Update User',
			description: 'Update user information by username',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Users'],
		}),
	checkUsernameAvailability: oc
		.input(dto.checkUsernameAvailabilityInput)
		.output(dto.checkUsernameAvailabilityOutput)
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
			path: '/users/check-username-availability',
			summary: 'Check Username Availability',
			description: 'Check if a username is available',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Users'],
		}),
};

export type Contract = typeof contract;
