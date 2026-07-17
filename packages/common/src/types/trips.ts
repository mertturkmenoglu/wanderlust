import { schema } from '@wanderlust/db';
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod';
import { z } from 'zod';
import { Places } from './places';
import { Resources } from './resources';
import { Timestamp } from './timestamp';
import { Users } from './users';

export const Trip = createSelectSchema(schema.trips, {
	id: Resources.id,
	ownerId: Resources.id,
	title: z
		.string()
		.min(1)
		.max(256)
		.meta({
			description: 'Title of the trip',
			examples: ['Summer Vacation in Europe'],
		}),
	description: z
		.string()
		.min(1)
		.max(8192)
		.meta({
			description: 'Description of the trip',
			examples: [
				'Exploring the beautiful cities and landscapes of Europe during summer.',
			],
		}),
	visibilityLevel: z.enum(['private', 'friends', 'public']).meta({
		description: 'Visibility level of the trip',
		examples: ['private'],
	}),
	requestedAmenities: z.array(z.string()).meta({
		description: 'List of requested amenities for the trip',
		examples: [['WiFi', 'Parking']],
	}),
	startAt: Timestamp,
	endAt: Timestamp,
	createdAt: Timestamp,
	updatedAt: Timestamp,
}).meta({
	description: 'A trip entity',
});

export namespace Trips {
	export const Extended = Trip.extend({
		owner: Users.View.Basic,
	});

	export const Invite = createSelectSchema(schema.tripInvites, {
		id: Resources.id,
		tripId: Resources.id,
		fromId: Resources.id,
		toId: Resources.id,
		sentAt: Timestamp,
		expiresAt: Timestamp,
		tripTitle: z
			.string()
			.min(1)
			.meta({
				description: 'Title of the trip',
				examples: ['Summer Vacation in Europe'],
			}),
		role: z.enum(['member', 'editor']).meta({
			description: 'Role of the user in the trip',
			examples: ['member'],
		}),
	}).meta({
		description: 'A trip invite entity',
	});

	export const InviteExtended = Invite.extend({
		from: Users.View.Basic,
		to: Users.View.Basic,
	});

	export const Comment = createSelectSchema(schema.tripComments, {
		id: Resources.id,
		tripId: Resources.id,
		userId: Resources.id,
		content: z
			.string()
			.min(1)
			.max(2048)
			.meta({
				description: 'Content of the comment',
				examples: ['Looking forward to this trip!'],
			}),
		createdAt: Timestamp,
		updatedAt: Timestamp,
	}).meta({
		description: 'A trip comment entity',
	});

	export type Comment = z.infer<typeof Comment>;

	export const Location = createSelectSchema(schema.tripLocations, {
		id: Resources.id,
		tripId: Resources.id,
		scheduledTime: Timestamp,
		placeId: Resources.id,
		description: z
			.string()
			.min(1)
			.max(1024)
			.meta({
				description: 'Description of the location',
				examples: ['Eiffel Tower'],
			}),
	}).meta({
		description: 'A trip location entity',
	});

	export const LocationExtended = Location.extend({
		place: Places.Extended,
		meta: Places.Meta,
	});

	export const Participant = createSelectSchema(schema.tripParticipants, {
		id: Resources.id,
		tripId: Resources.id,
		userId: Resources.id,
		role: z.enum(['member', 'editor']).meta({
			description: 'Role of the participant in the trip',
			examples: ['member'],
		}),
	}).meta({
		description: 'A trip participant entity',
	});

	export const ParticipantExtended = Participant.extend({
		user: Users.View.Basic,
	});

	export const ExtendedWithParticipantsAndLocations = Extended.extend({
		participants: z.array(ParticipantExtended),
		locations: z.array(LocationExtended),
	});

	export type ExtendedWithParticipantsAndLocations = z.infer<
		typeof ExtendedWithParticipantsAndLocations
	>;

	export namespace $Insert {
		export const Trip = createInsertSchema(schema.trips);

		export const Invite = createInsertSchema(schema.tripInvites);

		export const Comment = createInsertSchema(schema.tripComments);

		export const Location = createInsertSchema(schema.tripLocations);

		export const Participant = createInsertSchema(schema.tripParticipants);
	}
}
