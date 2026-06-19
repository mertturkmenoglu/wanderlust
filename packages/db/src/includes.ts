import type { TDatabaseService } from "./service";

type Query = TDatabaseService['query'];

type Domain = keyof Query;

type With<TDomain extends Domain> = NonNullable<Parameters<TDatabaseService['query'][TDomain]['findFirst']>[0]>['with'];

const withAddress = {
	city: true
} satisfies With<'addresses'>;

const withAccolade = {
	accolade: true,
} satisfies With<'accoladeAssignments'>;

const withPlace = {
	address: {
		with: withAddress,
	},
	accolades: {
		with: withAccolade,
	},
	category: true,
	assets: true,
} satisfies With<'places'>;

const withTripParticipant = {
	user: {
		columns: {
			id: true,
			name: true,
			username: true,
			image: true,
		}
	}
} satisfies With<'tripParticipants'>;

const withTrip = {
	participants: {
		orderBy: (t, { desc }) => [desc(t.id)],
		with: withTripParticipant,
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
		orderBy: (t, { asc }) => [asc(t.scheduledTime)],
		with: {
			place: {
				with: withPlace,
			},
		},
	},
} satisfies With<'trips'>;

const withTripInvite = {
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
} satisfies With<'tripInvites'>;

const withTripInviteDetails = {
	...withTripInvite,
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
} satisfies With<'tripInvites'>;

const withTripComment = {
	user: {
		columns: {
			id: true,
			name: true,
			username: true,
			image: true,
		},
	}
} satisfies With<'tripComments'>;

export const $includes = {
	accolade: withAccolade,
	address: withAddress,
	place: withPlace,
	tripParticipant: withTripParticipant,
	trip: withTrip,
	tripInvite: withTripInvite,
	tripInviteDetails: withTripInviteDetails,
	tripComment: withTripComment,
};
