import { oc } from '@orpc/contract';
import { ERRORS } from '../_common/errors';
import { dto } from './dto';

export const contract = oc
	.tag('Trips')
	.errors(ERRORS)
	.router({
		get: oc.input(dto.getInput).output(dto.getOutput).route({
			method: 'GET',
			path: '/trips/:id',
			summary: 'Get Trip',
			description: 'Retrieve details about a specific trip.',
		}),
		list: oc.input(dto.listInput).output(dto.listOutput).route({
			method: 'GET',
			path: '/trips',
			summary: 'List My Trips',
			description: 'Retrieve a list of trips for the current user.',
		}),
		create: oc.input(dto.createInput).output(dto.createOutput).route({
			method: 'POST',
			path: '/trips',
			summary: 'Create Trip',
			description: 'Create a new trip.',
			successStatus: 201,
			successDescription: 'Created',
		}),
		leave: oc.input(dto.leaveInput).output(dto.leaveOutput).route({
			method: 'DELETE',
			path: '/trips/:id/leave',
			summary: 'Leave Trip',
			description: 'Leave a trip',
			successStatus: 204,
			successDescription: 'No Content',
		}),
		delete: oc.input(dto.deleteInput).output(dto.deleteOutput).route({
			method: 'DELETE',
			path: '/trips/:id',
			summary: 'Delete Trip',
			description: 'Delete a trip by its ID',
			successStatus: 204,
			successDescription: 'No Content',
		}),
		update: oc.input(dto.updateInput).output(dto.updateOutput).route({
			method: 'PATCH',
			path: '/trips/:id',
			summary: 'Update Trip',
			description: 'Update a trip by its ID',
			successStatus: 200,
			successDescription: 'OK',
		}),

		invites: {
			list: oc.input(dto.listInvitesInput).output(dto.listInvitesOutput).route({
				method: 'GET',
				path: '/trips/:id/invites',
				summary: 'List Trip Invites',
				description: 'Retrieve a list of invites for a specific trip.',
			}),
			create: oc
				.input(dto.createInviteInput)
				.output(dto.createInviteOutput)
				.route({
					method: 'POST',
					path: '/trips/:id/invites',
					summary: 'Create Trip Invite',
					description: 'Create a new invite for a trip.',
					successStatus: 201,
					successDescription: 'Created',
				}),
			listMine: oc
				.input(dto.listMyInvitesInput)
				.output(dto.listMyInvitesOutput)
				.route({
					method: 'GET',
					path: '/trips/invites',
					summary: 'List My Trip Invites',
					description: 'Retrieve a list of invites for the current user.',
				}),
			getDetails: oc
				.input(dto.getInviteDetailsInput)
				.output(dto.getInviteDetailsOutput)
				.route({
					method: 'GET',
					path: '/trips/:id/invites/:inviteId',
					summary: 'Get Trip Invite Details',
					description: 'Retrieve details about a specific trip invite.',
				}),
			respond: oc.input(dto.respondInput).output(dto.respondOutput).route({
				method: 'POST',
				path: '/trips/:id/invites/:inviteId/respond',
				summary: 'Accept or Decline Trip Invite',
				description: 'Respond to a trip invite by accepting or declining it.',
			}),
			delete: oc
				.input(dto.deleteInviteInput)
				.output(dto.deleteInviteOutput)
				.route({
					method: 'DELETE',
					path: '/trips/:id/invites/:inviteId',
					summary: 'Delete Trip Invite',
					description: 'Delete a trip invite by its ID',
					successStatus: 204,
					successDescription: 'No Content',
				}),
		},

		participants: {
			delete: oc
				.input(dto.deleteParticipantInput)
				.output(dto.deleteParticipantOutput)
				.route({
					method: 'DELETE',
					path: '/trips/:id/participants/:userId',
					summary: 'Remove Trip Participant',
					description: 'Remove a participant from a trip',
					successStatus: 204,
					successDescription: 'No Content',
				}),
		},

		comments: {
			create: oc
				.input(dto.createCommentInput)
				.output(dto.createCommentOutput)
				.route({
					method: 'POST',
					path: '/trips/:id/comments',
					summary: 'Create Trip Comment',
					description: 'Create a comment for a trip',
					successStatus: 201,
					successDescription: 'Created',
				}),
			list: oc
				.input(dto.listCommentsInput)
				.output(dto.listCommentsOutput)
				.route({
					method: 'GET',
					path: '/trips/:id/comments',
					summary: 'List Trip Comments',
					description: 'Retrieve a list of comments for a trip',
				}),
			update: oc
				.input(dto.updateCommentInput)
				.output(dto.updateCommentOutput)
				.route({
					method: 'PATCH',
					path: '/trips/:id/comments/:commentId',
					summary: 'Update Trip Comment',
					description: 'Update a comment for a trip',
				}),
			delete: oc
				.input(dto.deleteCommentInput)
				.output(dto.deleteCommentOutput)
				.route({
					method: 'DELETE',
					path: '/trips/:id/comments/:commentId',
					summary: 'Delete Trip Comment',
					description: 'Delete a comment of a trip',
					successStatus: 204,
					successDescription: 'No Content',
				}),
		},

		locations: {
			create: oc
				.input(dto.createLocationInput)
				.output(dto.createLocationOutput)
				.route({
					method: 'POST',
					path: '/trips/:id/locations',
					summary: 'Create Trip Location',
					description: 'Create a new location for a trip',
					successStatus: 201,
					successDescription: 'Created',
				}),
			update: oc
				.input(dto.updateLocationInput)
				.output(dto.updateLocationOutput)
				.route({
					method: 'PATCH',
					path: '/trips/:id/locations/:locationId',
					summary: 'Update Trip Location',
					description: 'Update a location for a trip',
				}),
			delete: oc
				.input(dto.deleteLocationInput)
				.output(dto.deleteLocationOutput)
				.route({
					method: 'DELETE',
					path: '/trips/:id/locations/:locationId',
					summary: 'Delete Trip Location',
					description: 'Delete a location from a trip',
					successStatus: 204,
					successDescription: 'No Content',
				}),
		},

		getSummary: oc
			.input(dto.getSummaryInput)
			.output(dto.getSummaryOutput)
			.route({
				method: 'GET',
				path: '/trips/:id/summary',
				summary: 'Get Trip Summary',
				description: 'Get a summary of the trip',
			}),
	});

export type Contract = typeof contract;
