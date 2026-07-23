import type { DatabaseService } from './service';

type Query = DatabaseService['query'];

type Domain = keyof Query;

type With<TDomain extends Domain> = NonNullable<
	Parameters<DatabaseService['query'][TDomain]['findFirst']>[0]
>;

const withPlace = {
	with: {
		accolades: true,
		primaryCategory: true,
		city: true,
		assets: true,
	},
} satisfies With<'places'>;

const withTripParticipant = {
	with: {
		user: {
			columns: {
				id: true,
				name: true,
				username: true,
				image: true,
			},
		},
	},
} satisfies With<'tripParticipants'>;

const withTrip = {
	with: {
		participants: {
			orderBy: {
				id: 'desc',
			},
			with: withTripParticipant.with,
		},
		owner: {
			columns: {
				id: true,
				name: true,
				username: true,
				image: true,
			},
		},
		locations: {
			orderBy: {
				scheduledTime: 'asc',
			},
			with: {
				place: withPlace,
			},
		},
	},
} satisfies With<'trips'>;

const withTripInvite = {
	with: {
		fromUser: {
			columns: {
				id: true,
				name: true,
				username: true,
				image: true,
			},
		},
		toUser: {
			columns: {
				id: true,
				name: true,
				username: true,
				image: true,
			},
		},
	},
} satisfies With<'tripInvites'>;

const withTripInviteDetails = {
	with: {
		...withTripInvite.with,
		trip: {
			columns: {
				requestedAmenities: false,
				visibilityLevel: false,
				description: false,
			},
			with: {
				owner: {
					columns: {
						id: true,
						name: true,
						username: true,
						image: true,
					},
				},
			},
		},
	},
} satisfies With<'tripInvites'>;

const withTripComment = {
	with: {
		user: {
			columns: {
				id: true,
				name: true,
				username: true,
				image: true,
			},
		},
	},
} satisfies With<'tripComments'>;

export const $includes = {
	place: withPlace,
	tripParticipant: withTripParticipant,
	trip: withTrip,
	tripInvite: withTripInvite,
	tripInviteDetails: withTripInviteDetails,
	tripComment: withTripComment,
};
