import { $dto, Pagination } from '@wanderlust/common';
import z from 'zod';
import { amenities } from '../amenities/consts';

const trip = $dto.trip.extend(
	z.object({
		owner: $dto.user.pick({
			id: true,
			name: true,
			username: true,
			image: true,
		}),
	}).shape,
);

const tripParticipant = $dto.tripParticipant.extend(
	z.object({
		user: $dto.user.pick({
			id: true,
			name: true,
			username: true,
			image: true,
		}),
	}).shape,
);

const invite = $dto.tripInvite.extend(
	z.object({
		fromUser: $dto.user.pick({
			id: true,
			name: true,
			username: true,
			image: true,
		}),
		toUser: $dto.user.pick({
			id: true,
			name: true,
			username: true,
			image: true,
		}),
	}).shape,
);

const place = $dto.place.extend({
	assets: $dto.asset.array(),
	category: $dto.category,
	address: $dto.address.extend({
		city: $dto.city,
	}),
});

const location = $dto.tripLocation.extend(
	z.object({
		place: place,
		meta: z.object({
			isFavorite: z.boolean(),
		}),
	}).shape,
);

const extendedTrip = trip.extend(
	z.object({
		participants: z.array(tripParticipant),
		locations: z.array(location),
	}).shape,
);

export type ExtendedTrip = z.infer<typeof extendedTrip>;

export type Comment = z.infer<typeof $dto.tripComment>;

export const getInput = trip.pick({
	id: true,
});

export type GetInput = z.infer<typeof getInput>;

export const getOutput = z.object({
	trip: extendedTrip,
});

export type GetOutput = z.infer<typeof getOutput>;

export const listInvitesInput = trip.pick({
	id: true,
});

export type ListInvitesInput = z.infer<typeof listInvitesInput>;

export const listInvitesOutput = z.object({
	invites: z.array(invite),
});

export type ListInvitesOutput = z.infer<typeof listInvitesOutput>;

export const createInviteInput = trip
	.pick({
		id: true,
	})
	.extend({
		toUserId: $dto.user.pick({ id: true }).shape.id,
		role: $dto.tripParticipant.pick({ role: true }).shape.role,
	});

export type CreateInviteInput = z.infer<typeof createInviteInput>;

export const createInviteOutput = z.object({
	invite: invite,
});

export type CreateInviteOutput = z.infer<typeof createInviteOutput>;

export const listInput = Pagination.queryParamsSchema.extend({});

export type ListInput = z.infer<typeof listInput>;

export const listOutput = z.object({
	trips: z.array(trip),
	pagination: Pagination.schema,
});

export type ListOutput = z.infer<typeof listOutput>;

export const listMyInvitesInput = Pagination.queryParamsSchema.extend({});

export type ListMyInvitesInput = z.infer<typeof listMyInvitesInput>;

export const listMyInvitesOutput = z.object({
	invites: z.array(invite),
	pagination: Pagination.schema,
});

export type ListMyInvitesOutput = z.infer<typeof listMyInvitesOutput>;

export const createInput = trip.pick({
	title: true,
	description: true,
	visibilityLevel: true,
	startAt: true,
	endAt: true,
});

export type CreateInput = z.infer<typeof createInput>;

export const createOutput = z.object({
	trip: trip,
});

export type CreateOutput = z.infer<typeof createOutput>;

export const getInviteDetailsInput = trip
	.pick({
		id: true,
	})
	.extend({
		inviteId: $dto.tripInvite.pick({ id: true }).shape.id,
	});

export type GetInviteDetailsInput = z.infer<typeof getInviteDetailsInput>;

export const getInviteDetailsOutput = z.object({
	invite: invite.extend({
		trip: trip.omit({
			requestedAmenities: true,
			visibilityLevel: true,
			description: true,
		}),
	}),
});

export type GetInviteDetailsOutput = z.infer<typeof getInviteDetailsOutput>;

export const acceptOrDeclineInviteInput = trip
	.pick({
		id: true,
	})
	.extend({
		inviteId: $dto.tripInvite.pick({ id: true }).shape.id,
		accept: z.boolean().meta({
			description: 'Whether to accept or decline the invite',
			examples: [true],
		}),
	});

export type AcceptOrDeclineInviteInput = z.infer<
	typeof acceptOrDeclineInviteInput
>;

export const acceptOrDeclineInviteOutput = z.object({
	accepted: z.boolean().meta({
		description: 'Whether the invite was accepted',
		examples: [true],
	}),
});

export type AcceptOrDeclineInviteOutput = z.infer<
	typeof acceptOrDeclineInviteOutput
>;

export const leaveInput = trip.pick({
	id: true,
});

export type LeaveInput = z.infer<typeof leaveInput>;

export const leaveOutput = z.object({});

export type LeaveOutput = z.infer<typeof leaveOutput>;

export const deleteInviteInput = trip
	.pick({
		id: true,
	})
	.extend({
		inviteId: $dto.tripInvite.pick({ id: true }).shape.id,
	});

export type DeleteInviteInput = z.infer<typeof deleteInviteInput>;

export const deleteInviteOutput = z.object({});

export type DeleteInviteOutput = z.infer<typeof deleteInviteOutput>;

export const deleteInput = trip.pick({
	id: true,
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});

export type DeleteOutput = z.infer<typeof deleteOutput>;

export const deleteParticipantInput = trip
	.pick({
		id: true,
	})
	.extend({
		userId: $dto.user.pick({ id: true }).shape.id,
	});

export type DeleteParticipantInput = z.infer<typeof deleteParticipantInput>;

export const deleteParticipantOutput = z.object({});

export type DeleteParticipantOutput = z.infer<typeof deleteParticipantOutput>;

export const createCommentInput = trip
	.pick({
		id: true,
	})
	.extend({
		content: $dto.tripComment.shape.content,
	});

export type CreateCommentInput = z.infer<typeof createCommentInput>;

export const createCommentOutput = z.object({
	comment: $dto.tripComment,
});

export type CreateCommentOutput = z.infer<typeof createCommentOutput>;

export const listCommentsInput = Pagination.queryParamsSchema.extend(
	trip.pick({
		id: true,
	}).shape,
);

export type ListCommentsInput = z.infer<typeof listCommentsInput>;

export const listCommentsOutput = z.object({
	comments: $dto.tripComment
		.extend({
			user: $dto.user.pick({
				id: true,
				name: true,
				username: true,
				image: true,
			}),
		})
		.array(),
	pagination: Pagination.schema,
});

export type ListCommentsOutput = z.infer<typeof listCommentsOutput>;

export const updateCommentInput = trip
	.pick({
		id: true,
	})
	.extend({
		commentId: $dto.tripComment.pick({ id: true }).shape.id,
		content: $dto.tripComment.shape.content,
	});

export type UpdateCommentInput = z.infer<typeof updateCommentInput>;

export const updateCommentOutput = z.object({
	comment: $dto.tripComment,
});

export type UpdateCommentOutput = z.infer<typeof updateCommentOutput>;

export const deleteCommentInput = trip
	.pick({
		id: true,
	})
	.extend({
		commentId: $dto.tripComment.pick({ id: true }).shape.id,
	});

export type DeleteCommentInput = z.infer<typeof deleteCommentInput>;

export const deleteCommentOutput = z.object({});

export type DeleteCommentOutput = z.infer<typeof deleteCommentOutput>;

export const updateInput = trip.pick({
	id: true,
	title: true,
	description: true,
	visibilityLevel: true,
	startAt: true,
	endAt: true,
});

export type UpdateInput = z.infer<typeof updateInput>;

export const updateOutput = z.object({
	trip: trip.extend(
		z.object({
			participants: z.array(tripParticipant),
			locations: z.array(location),
		}).shape,
	),
});

export type UpdateOutput = z.infer<typeof updateOutput>;

export const createLocationInput = trip
	.pick({
		id: true,
	})
	.extend(
		$dto.tripLocation
			.pick({
				placeId: true,
				scheduledTime: true,
			})
			.extend({
				description: $dto.tripLocation.shape.description.optional(),
			}).shape,
	);

export type CreateLocationInput = z.infer<typeof createLocationInput>;

export const createLocationOutput = z.object({
	location: location,
});

export type CreateLocationOutput = z.infer<typeof createLocationOutput>;

export const updateLocationInput = trip
	.pick({
		id: true,
	})
	.extend({
		locationId: $dto.tripLocation.pick({ id: true }).shape.id,
		description: $dto.tripLocation.shape.description.optional(),
		scheduledTime: $dto.tripLocation.shape.scheduledTime.optional(),
	});

export type UpdateLocationInput = z.infer<typeof updateLocationInput>;

export const updateLocationOutput = z.object({
	location: location,
});

export type UpdateLocationOutput = z.infer<typeof updateLocationOutput>;

export const deleteLocationInput = trip
	.pick({
		id: true,
	})
	.extend({
		locationId: $dto.tripLocation.pick({ id: true }).shape.id,
	});

export type DeleteLocationInput = z.infer<typeof deleteLocationInput>;

export const deleteLocationOutput = z.object({});

export type DeleteLocationOutput = z.infer<typeof deleteLocationOutput>;

export const updateRequestedAmenitiesInput = z.object({
	id: trip.shape.id,
	amenities: z.array(z.string()).min(0).max(amenities.length),
});

export type UpdateRequestedAmenitiesInput = z.infer<
	typeof updateRequestedAmenitiesInput
>;

export const updateRequestedAmenitiesOutput = z.object({
	trip: trip,
});

export type UpdateRequestedAmenitiesOutput = z.infer<
	typeof updateRequestedAmenitiesOutput
>;

export const getSummaryInput = trip.pick({ id: true });

export type GetSummaryInput = z.infer<typeof getSummaryInput>;

export const getSummaryOutput = z.object({
	trip: trip,
	totalCities: z.number(),
	totalDays: z.number(),
	totalParticipants: z.number(),
	totalLocations: z.number(),
	totalComments: z.number(),
	totalItineraryItems: z.number(),
	totalAssets: z.number(),
});

export type GetSummaryOutput = z.infer<typeof getSummaryOutput>;
