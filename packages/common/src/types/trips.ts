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

	export const ItineraryItem = createSelectSchema(schema.itineraryItems, {
		id: Resources.id,
		tripId: Resources.id,
		scheduledTime: Timestamp,
		type: z
			.enum([
				'accommodation',
				'transportation',
				'event',
				'location',
				'dining',
				'other',
			])
			.meta({
				description: 'Type of the itinerary item',
				examples: ['accommodation'],
			}),
		booked: z
			.boolean()
			.nullable()
			.meta({
				description:
					'Whether the itinerary item is booked or not. If not applicable, it can be null.',
				examples: [true],
			}),
		checkInTime: Timestamp.nullable().meta({
			description:
				'Check-in time for the itinerary item. If not applicable, it can be null.',
			examples: ['2023-08-01T15:00:00Z'],
		}),
		checkOutTime: Timestamp.nullable().meta({
			description:
				'Check-out time for the itinerary item. If not applicable, it can be null.',
			examples: ['2023-08-05T11:00:00Z'],
		}),
		reservationNumber: z
			.string()
			.min(1)
			.max(64)
			.nullable()
			.meta({
				description:
					'Reservation number for the itinerary item. If not applicable, it can be null.',
				examples: ['ABC123456'],
			}),
		notes: z
			.string()
			.min(1)
			.max(1024)
			.nullable()
			.meta({
				description:
					'Additional notes for the itinerary item. If not applicable, it can be null.',
				examples: ['Remember to bring your passport.'],
			}),
		transportationMode: z
			.enum(['flight', 'car', 'train', 'bus', 'boat', 'other'])
			.nullable()
			.meta({
				description:
					'Mode of transportation for the itinerary item. If not applicable, it can be null.',
				examples: ['flight'],
			}),
		transportationName: z
			.string()
			.min(1)
			.max(256)
			.nullable()
			.meta({
				description:
					'Name of the transportation service for the itinerary item. If not applicable, it can be null.',
				examples: ['Turkish Airlines'],
			}),
		departureLocation: z
			.string()
			.min(1)
			.max(256)
			.nullable()
			.meta({
				description:
					'Departure location for the itinerary item. If not applicable, it can be null.',
				examples: ['JFK Airport'],
			}),
		arrivalLocation: z
			.string()
			.min(1)
			.max(256)
			.nullable()
			.meta({
				description:
					'Arrival location for the itinerary item. If not applicable, it can be null.',
				examples: ['LAX Airport'],
			}),
		departureTime: Timestamp.nullable().meta({
			description:
				'Departure time for the itinerary item. If not applicable, it can be null.',
			examples: ['2023-08-01T15:00:00Z'],
		}),
		arrivalTime: Timestamp.nullable().meta({
			description:
				'Arrival time for the itinerary item. If not applicable, it can be null.',
			examples: ['2023-08-01T18:00:00Z'],
		}),
		transportationConfirmationNumber: z
			.string()
			.min(1)
			.max(64)
			.nullable()
			.meta({
				description:
					'Transportation confirmation number for the itinerary item. If not applicable, it can be null.',
				examples: ['CONF123456'],
			}),
		title: z
			.string()
			.min(1)
			.max(256)
			.nullable()
			.meta({
				description: 'Title of the itinerary item',
				examples: ['Flight to Los Angeles'],
			}),
		placeId: Resources.id.nullable().meta({
			description:
				'ID of the associated place for the itinerary item. If not applicable, it can be null.',
			examples: ['place_123456'],
		}),
	}).meta({
		description: 'A trip itinerary item entity',
	});

	export type ItineraryItem = z.infer<typeof ItineraryItem>;

	export const ItineraryItemExtended = ItineraryItem.extend({
		place: z
			.object({
				place: Places.Extended,
				meta: Places.Meta,
			})
			.nullable(),
	});

	export type ItineraryItemExtended = z.infer<typeof ItineraryItemExtended>;

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

	export const ExtendedWithParticipantsAndItinerary = Extended.extend({
		participants: z.array(ParticipantExtended),
		itineraryItems: z.array(ItineraryItemExtended),
	});

	export type ExtendedWithParticipantsAndItinerary = z.infer<
		typeof ExtendedWithParticipantsAndItinerary
	>;

	export namespace $Insert {
		export const Trip = createInsertSchema(schema.trips);

		export const Invite = createInsertSchema(schema.tripInvites);

		export const Comment = createInsertSchema(schema.tripComments);

		export const ItineraryItem = createInsertSchema(schema.itineraryItems);

		export const Participant = createInsertSchema(schema.tripParticipants);
	}
}
