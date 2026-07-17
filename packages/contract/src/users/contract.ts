import { oc } from '@orpc/contract';
import { ERRORS } from '../_common/errors';
import { dto } from './dto';

export const contract = oc
	.tag('Users')
	.errors(ERRORS)
	.router({
		updateImage: oc
			.input(dto.updateImageInput)
			.output(dto.updateImageOutput)
			.route({
				method: 'POST',
				path: '/users/image',
				summary: 'Update Image',
				description: 'Update the profile image or the banner image of the user',
				successStatus: 201,
				successDescription: 'Created',
			}),
		getRole: oc.input(dto.getRoleInput).output(dto.getRoleOutput).route({
			method: 'GET',
			path: '/users/me/role',
			summary: 'Get User Role',
			description: 'Retrieve the role of the currently authenticated user',
		}),
		get: oc.input(dto.getInput).output(dto.getOutput).route({
			method: 'GET',
			path: '/users/:username',
			summary: 'Get User Profile',
			description: 'Retrieve the profile of a user by their username',
		}),
		getById: oc.input(dto.getByIdInput).output(dto.getByIdOutput).route({
			method: 'GET',
			path: '/users/id/:id',
			summary: 'Get User by ID',
			description: 'Retrieve the profile of a user by their ID',
		}),
		getMe: oc.input(dto.getMeInput).output(dto.getMeOutput).route({
			method: 'GET',
			path: '/users',
			summary: 'Get Current User',
			description: 'Retrieve the profile of the currently authenticated user',
		}),
		listFollowers: oc
			.input(dto.listFollowersInput)
			.output(dto.listFollowersOutput)
			.route({
				method: 'GET',
				path: '/users/:username/followers',
				summary: 'List User Followers',
				description:
					'Retrieve a list of followers for a user by their username',
			}),
		listFollowing: oc
			.input(dto.listFollowingInput)
			.output(dto.listFollowingOutput)
			.route({
				method: 'GET',
				path: '/users/:username/following',
				summary: 'List User Following',
				description: 'Retrieve a list of users followed by a user',
			}),
		listTopPlaces: oc
			.input(dto.listTopPlacesInput)
			.output(dto.listTopPlacesOutput)
			.route({
				method: 'GET',
				path: '/users/:username/top-places',
				summary: 'List User Top Places',
				description: 'Retrieve a list of top places of a user',
			}),
		updateTopPlaces: oc
			.input(dto.updateTopPlacesInput)
			.output(dto.updateTopPlacesOutput)
			.route({
				method: 'PATCH',
				path: '/users/top-places',
				summary: 'Update User Top Places',
				description: 'Update the list of top places of this user',
			}),
		listActivities: oc
			.input(dto.listUserActivitiesInput)
			.output(dto.listUserActivitiesOutput)
			.route({
				method: 'GET',
				path: '/users/:username/activities',
				summary: 'List User Activities',
				description:
					'Retrieve a list of activities for a user by their username',
			}),
		searchFollowing: oc
			.input(dto.searchFollowingInput)
			.output(dto.searchFollowingOutput)
			.route({
				method: 'GET',
				path: '/users/search/following',
				summary: 'Search User Following',
				description: 'Search for following of this user',
			}),
		follow: oc.input(dto.followInput).output(dto.followOutput).route({
			method: 'POST',
			path: '/users/:username/follow',
			summary: 'Follow/Unfollow User',
			description: 'Follow or unfollow a user by their username',
		}),
		update: oc.input(dto.updateInput).output(dto.updateOutput).route({
			method: 'PATCH',
			path: '/users/:username',
			summary: 'Update User',
			description: 'Update user information by username',
		}),
		checkUsernameAvailability: oc
			.input(dto.checkUsernameAvailabilityInput)
			.output(dto.checkUsernameAvailabilityOutput)
			.route({
				method: 'GET',
				path: '/users/check-username-availability',
				summary: 'Check Username Availability',
				description: 'Check if a username is available',
			}),
	});

export type Contract = typeof contract;
