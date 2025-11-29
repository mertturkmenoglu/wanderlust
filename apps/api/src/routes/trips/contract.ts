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
			path: '/trips/:id',
			summary: 'Get Trip',
			description: 'Retrieve details about a specific trip.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Trips'],
		}),
	listInvites: oc
		.input(dto.listInvitesInput)
		.output(dto.listInvitesOutput)
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
			path: '/trips/:id/invites',
			summary: 'List Trip Invites',
			description: 'Retrieve a list of invites for a specific trip.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Trips'],
		}),
	createInvite: oc
		.input(dto.createInviteInput)
		.output(dto.createInviteOutput)
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
			path: '/trips/:id/invites',
			summary: 'Create Trip Invite',
			description: 'Create a new invite for a trip.',
			successStatus: 201,
			successDescription: 'Created',
			tags: ['Trips'],
		}),
	list: oc
		.input(dto.listInput)
		.output(dto.listOutput)
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
			path: '/trips',
			summary: 'List My Trips',
			description: 'Retrieve a list of trips for the current user.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Trips'],
		}),
	listMyInvites: oc
		.input(dto.listMyInvitesInput)
		.output(dto.listMyInvitesOutput)
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
			path: '/trips/invites',
			summary: 'List My Trip Invites',
			description: 'Retrieve a list of invites for the current user.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Trips'],
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
			path: '/trips',
			summary: 'Create Trip',
			description: 'Create a new trip.',
			successStatus: 201,
			successDescription: 'Created',
			tags: ['Trips'],
		}),
	getInviteDetails: oc
		.input(dto.getInviteDetailsInput)
		.output(dto.getInviteDetailsOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			GONE: {
				status: 410,
			},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'GET',
			path: '/trips/:id/invites/:inviteId',
			summary: 'Get Trip Invite Details',
			description: 'Retrieve details about a specific trip invite.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Trips'],
		}),
	acceptOrDeclineInvite: oc
		.input(dto.acceptOrDeclineInviteInput)
		.output(dto.acceptOrDeclineInviteOutput)
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
			path: '/trips/:id/invites/:inviteid/respond',
			summary: 'Accept or Decline Trip Invite',
			description: 'Respond to a trip invite by accepting or declining it.',
			successStatus: 202,
			successDescription: 'Accepted',
			tags: ['Trips'],
		}),
	leave: oc
		.input(dto.leaveInput)
		.output(dto.leaveOutput)
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
			path: '/trips/:id/leave',
			summary: 'Leave Trip',
			description: 'Leave a trip',
			successStatus: 204,
			successDescription: 'No Content',
			tags: ['Trips'],
		}),
	deleteInvite: oc
		.input(dto.deleteInviteInput)
		.output(dto.deleteInviteOutput)
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
			path: '/trips/:id/invites/:inviteId',
			summary: 'Delete Trip Invite',
			description: 'Delete a trip invite by its ID',
			successStatus: 204,
			successDescription: 'No Content',
			tags: ['Trips'],
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
			path: '/trips/:id',
			summary: 'Delete Trip',
			description: 'Delete a trip by its ID',
			successStatus: 204,
			successDescription: 'No Content',
			tags: ['Trips'],
		}),
	deleteParticipant: oc
		.input(dto.deleteParticipantInput)
		.output(dto.deleteParticipantOutput)
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
			path: '/trips/:id/participants/:userId',
			summary: 'Remove Trip Participant',
			description: 'Remove a participant from a trip',
			successStatus: 204,
			successDescription: 'No Content',
			tags: ['Trips'],
		}),
	createComment: oc
		.input(dto.createCommentInput)
		.output(dto.createCommentOutput)
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
			path: '/trips/:id/comments',
			summary: 'Create Trip Comment',
			description: 'Create a comment for a trip',
			successStatus: 201,
			successDescription: 'Created',
			tags: ['Trips'],
		}),
	listComments: oc
		.input(dto.listCommentsInput)
		.output(dto.listCommentsOutput)
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
			path: '/trips/:id/comments',
			summary: 'List Trip Comments',
			description: 'Retrieve a list of comments for a trip',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Trips'],
		}),
	updateComment: oc
		.input(dto.updateCommentInput)
		.output(dto.updateCommentOutput)
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
			path: '/trips/:id/comments/:commentId',
			summary: 'Update Trip Comment',
			description: 'Update a comment for a trip',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Trips'],
		}),
	deleteComment: oc
		.input(dto.deleteCommentInput)
		.output(dto.deleteCommentOutput)
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
			path: '/trips/:id/comments/:commentId',
			summary: 'Delete Trip Comment',
			description: 'Delete a comment of a trip',
			successStatus: 204,
			successDescription: 'No Content',
			tags: ['Trips'],
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
			path: '/trips/:id',
			summary: 'Update Trip',
			description: 'Update a trip by its ID',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Trips'],
		}),
	createLocation: oc
		.input(dto.createLocationInput)
		.output(dto.createLocationOutput)
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
			path: '/trips/:id/locations',
			summary: 'Create Trip Location',
			description: 'Create a new location for a trip',
			successStatus: 201,
			successDescription: 'Created',
			tags: ['Trips'],
		}),
	updateLocation: oc
		.input(dto.updateLocationInput)
		.output(dto.updateLocationOutput)
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
			path: '/trips/:id/locations/:locationId',
			summary: 'Update Trip Location',
			description: 'Update a location for a trip',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Trips'],
		}),
	deleteLocation: oc
		.input(dto.deleteLocationInput)
		.output(dto.deleteLocationOutput)
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
			path: '/trips/:id/locations/:locationId',
			summary: 'Delete Trip Location',
			description: 'Delete a location from a trip',
			successStatus: 204,
			successDescription: 'No Content',
			tags: ['Trips'],
		}),
};
