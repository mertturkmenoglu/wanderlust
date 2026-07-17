import { Types } from '@wanderlust/common';
import z from 'zod';
import { Amenities } from '../amenities/index';

export namespace dto {
	export const getInput = Types.Trip.pick({
		id: true,
	});

	export type GetInput = z.infer<typeof getInput>;

	export const getOutput = z.object({
		trip: Types.Trips.ExtendedWithParticipantsAndLocations,
	});

	export type GetOutput = z.infer<typeof getOutput>;

	export const listInvitesInput = Types.Trip.pick({
		id: true,
	});

	export type ListInvitesInput = z.infer<typeof listInvitesInput>;

	export const listInvitesOutput = z.object({
		invites: z.array(Types.Trips.InviteExtended),
	});

	export type ListInvitesOutput = z.infer<typeof listInvitesOutput>;

	export const createInviteInput = Types.Trip.pick({
		id: true,
	}).extend({
		toUserId: Types.User.pick({ id: true }).shape.id,
		role: Types.Trips.Participant.pick({ role: true }).shape.role,
	});

	export type CreateInviteInput = z.infer<typeof createInviteInput>;

	export const createInviteOutput = z.object({
		invite: Types.Trips.InviteExtended,
	});

	export type CreateInviteOutput = z.infer<typeof createInviteOutput>;

	export const listInput = Types.Pagination.queryParamsSchema.extend({});

	export type ListInput = z.infer<typeof listInput>;

	export const listOutput = z.object({
		trips: z.array(Types.Trip),
		pagination: Types.Pagination.schema,
	});

	export type ListOutput = z.infer<typeof listOutput>;

	export const listMyInvitesInput = Types.Pagination.queryParamsSchema.extend(
		{},
	);

	export type ListMyInvitesInput = z.infer<typeof listMyInvitesInput>;

	export const listMyInvitesOutput = z.object({
		invites: z.array(Types.Trips.InviteExtended),
		pagination: Types.Pagination.schema,
	});

	export type ListMyInvitesOutput = z.infer<typeof listMyInvitesOutput>;

	export const createInput = Types.Trip.pick({
		title: true,
		description: true,
		visibilityLevel: true,
		startAt: true,
		endAt: true,
	});

	export type CreateInput = z.infer<typeof createInput>;

	export const createOutput = z.object({
		trip: Types.Trip,
	});

	export type CreateOutput = z.infer<typeof createOutput>;

	export const getInviteDetailsInput = Types.Trip.pick({
		id: true,
	}).extend({
		inviteId: Types.Trips.Invite.pick({ id: true }).shape.id,
	});

	export type GetInviteDetailsInput = z.infer<typeof getInviteDetailsInput>;

	export const getInviteDetailsOutput = z.object({
		invite: Types.Trips.InviteExtended.extend({
			trip: Types.Trip.omit({
				requestedAmenities: true,
				visibilityLevel: true,
				description: true,
			}),
		}),
	});

	export type GetInviteDetailsOutput = z.infer<typeof getInviteDetailsOutput>;

	export const respondInput = Types.Trip.pick({
		id: true,
	}).extend({
		inviteId: Types.Trips.Invite.pick({ id: true }).shape.id,
		accept: z.boolean().meta({
			description: 'Whether to accept or decline the invite',
			examples: [true],
		}),
	});

	export type RespondInput = z.infer<typeof respondInput>;

	export const respondOutput = z.object({
		accepted: z.boolean().meta({
			description: 'Whether the invite was accepted',
			examples: [true],
		}),
	});

	export type RespondOutput = z.infer<typeof respondOutput>;

	export const leaveInput = Types.Trip.pick({
		id: true,
	});

	export type LeaveInput = z.infer<typeof leaveInput>;

	export const leaveOutput = z.object({});

	export type LeaveOutput = z.infer<typeof leaveOutput>;

	export const deleteInviteInput = Types.Trip.pick({
		id: true,
	}).extend({
		inviteId: Types.Trips.Invite.pick({ id: true }).shape.id,
	});

	export type DeleteInviteInput = z.infer<typeof deleteInviteInput>;

	export const deleteInviteOutput = z.object({});

	export type DeleteInviteOutput = z.infer<typeof deleteInviteOutput>;

	export const deleteInput = Types.Trip.pick({
		id: true,
	});

	export type DeleteInput = z.infer<typeof deleteInput>;

	export const deleteOutput = z.object({});

	export type DeleteOutput = z.infer<typeof deleteOutput>;

	export const deleteParticipantInput = Types.Trip.pick({
		id: true,
	}).extend({
		userId: Types.User.pick({ id: true }).shape.id,
	});

	export type DeleteParticipantInput = z.infer<typeof deleteParticipantInput>;

	export const deleteParticipantOutput = z.object({});

	export type DeleteParticipantOutput = z.infer<typeof deleteParticipantOutput>;

	export const createCommentInput = Types.Trip.pick({
		id: true,
	}).extend({
		content: Types.Trips.Comment.shape.content,
	});

	export type CreateCommentInput = z.infer<typeof createCommentInput>;

	export const createCommentOutput = z.object({
		comment: Types.Trips.Comment,
	});

	export type CreateCommentOutput = z.infer<typeof createCommentOutput>;

	export const listCommentsInput = Types.Pagination.queryParamsSchema.extend(
		Types.Trip.pick({
			id: true,
		}).shape,
	);

	export type ListCommentsInput = z.infer<typeof listCommentsInput>;

	export const listCommentsOutput = z.object({
		comments: Types.Trips.Comment.extend({
			user: Types.Users.View.Basic,
		}).array(),
		pagination: Types.Pagination.schema,
	});

	export type ListCommentsOutput = z.infer<typeof listCommentsOutput>;

	export const updateCommentInput = Types.Trip.pick({
		id: true,
	}).extend({
		commentId: Types.Trips.Comment.shape.id,
		content: Types.Trips.Comment.shape.content,
	});

	export type UpdateCommentInput = z.infer<typeof updateCommentInput>;

	export const updateCommentOutput = z.object({
		comment: Types.Trips.Comment,
	});

	export type UpdateCommentOutput = z.infer<typeof updateCommentOutput>;

	export const deleteCommentInput = Types.Trip.pick({
		id: true,
	}).extend({
		commentId: Types.Trips.Comment.shape.id,
	});

	export type DeleteCommentInput = z.infer<typeof deleteCommentInput>;

	export const deleteCommentOutput = z.object({});

	export type DeleteCommentOutput = z.infer<typeof deleteCommentOutput>;

	export const updateInput = Types.Trip.pick({
		id: true,
		title: true,
		description: true,
		visibilityLevel: true,
		startAt: true,
		endAt: true,
		requestedAmenities: true,
	});

	export type UpdateInput = z.infer<typeof updateInput>;

	export const updateOutput = z.object({
		trip: Types.Trips.ExtendedWithParticipantsAndLocations,
	});

	export type UpdateOutput = z.infer<typeof updateOutput>;

	export const createLocationInput = Types.Trip.pick({
		id: true,
	}).extend(
		Types.Trips.Location.pick({
			placeId: true,
			scheduledTime: true,
		}).extend({
			description: Types.Trips.Location.shape.description.optional(),
		}).shape,
	);

	export type CreateLocationInput = z.infer<typeof createLocationInput>;

	export const createLocationOutput = z.object({
		location: Types.Trips.LocationExtended,
	});

	export type CreateLocationOutput = z.infer<typeof createLocationOutput>;

	export const updateLocationInput = Types.Trip.pick({
		id: true,
	}).extend({
		locationId: Types.Trips.Location.shape.id,
		description: Types.Trips.Location.shape.description.optional(),
		scheduledTime: Types.Trips.Location.shape.scheduledTime.optional(),
	});

	export type UpdateLocationInput = z.infer<typeof updateLocationInput>;

	export const updateLocationOutput = z.object({
		location: Types.Trips.LocationExtended,
	});

	export type UpdateLocationOutput = z.infer<typeof updateLocationOutput>;

	export const deleteLocationInput = Types.Trip.pick({
		id: true,
	}).extend({
		locationId: Types.Trips.Location.pick({ id: true }).shape.id,
	});

	export type DeleteLocationInput = z.infer<typeof deleteLocationInput>;

	export const deleteLocationOutput = z.object({});

	export type DeleteLocationOutput = z.infer<typeof deleteLocationOutput>;

	export const updateRequestedAmenitiesInput = z.object({
		id: Types.Trip.shape.id,
		amenities: z.array(z.string()).min(0).max(Amenities.values.length),
	});

	export type UpdateRequestedAmenitiesInput = z.infer<
		typeof updateRequestedAmenitiesInput
	>;

	export const updateRequestedAmenitiesOutput = z.object({
		trip: Types.Trip,
	});

	export type UpdateRequestedAmenitiesOutput = z.infer<
		typeof updateRequestedAmenitiesOutput
	>;

	export const getSummaryInput = Types.Trip.pick({ id: true });

	export type GetSummaryInput = z.infer<typeof getSummaryInput>;

	export const getSummaryOutput = z.object({
		trip: Types.Trips.ExtendedWithParticipantsAndLocations,
		totalCities: z.number(),
		totalDays: z.number(),
		totalParticipants: z.number(),
		totalLocations: z.number(),
		totalComments: z.number(),
		totalItineraryItems: z.number(),
		totalAssets: z.number(),
	});

	export type GetSummaryOutput = z.infer<typeof getSummaryOutput>;
}
