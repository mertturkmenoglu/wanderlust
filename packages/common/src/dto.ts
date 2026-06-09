import {
	accounts,
	addresses,
	assets,
	bookmarks,
	categories,
	cities,
	collectionItems,
	collections,
	collectionsCities,
	collectionsPlaces,
	eventAgendaItems,
	eventInterests,
	eventLineupItems,
	events,
	eventTicketOptions,
	favorites,
	follows,
	listItems,
	lists,
	places,
	reports,
	reviews,
	tripComments,
	tripInvites,
	tripLocations,
	tripParticipants,
	trips,
	users,
	userTopPlaces,
} from '@wanderlust/db';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

export const $dto = {
	user: createSelectSchema(users, {
		id: z
			.string()
			.min(1)
			.meta({
				description: 'User ID',
				examples: ['abcdef1234'],
			}),
		name: z
			.string()
			.min(1)
			.max(256)
			.meta({
				description: 'Full name of the user',
				examples: ['John Doe'],
			}),
		username: z
			.string()
			.min(4)
			.max(32)
			.meta({
				description: 'Unique username of the user',
				examples: ['johndoe'],
			}),
		email: z.email().meta({
			description: 'Email address of the user',
			examples: ['johndoe@example.com'],
		}),
		emailVerified: z.boolean().meta({
			description: "Whether the user's email is verified",
			examples: [true],
		}),
		image: z
			.url()
			.nullable()
			.meta({
				description: 'Profile image URL of the user',
				examples: ['https://example.com/images/johndoe.jpg'],
			}),
		banner: z
			.url()
			.nullable()
			.meta({
				description: 'Banner image URL of the user',
				examples: ['https://example.com/images/johndoe-banner.jpg'],
			}),
		bio: z
			.string()
			.max(512)
			.nullable()
			.meta({
				description: 'Short biography of the user',
				examples: [
					'Travel enthusiast and photographer. Love exploring new places!',
				],
			}),
		website: z
			.url()
			.nullable()
			.meta({
				description: 'Personal website URL of the user',
				examples: ['https://johndoe.com'],
			}),
		followersCount: z
			.number()
			.int()
			.min(0)
			.meta({
				description: 'Number of followers the user has',
				examples: [150],
			}),
		followingCount: z
			.number()
			.int()
			.min(0)
			.meta({
				description: 'Number of users the user is following',
				examples: [75],
			}),
		createdAt: z.date().meta({
			description: 'Timestamp when the user was created',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
		updatedAt: z.date().meta({
			description: 'Timestamp when the user was last updated',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
	}).meta({
		description: 'A user entity',
	}),
	asset: createSelectSchema(assets, {
		id: z
			.number()
			.int()
			.meta({
				description: 'Asset ID',
				examples: [123456],
			}),
		entityType: z.enum(['place', 'review', 'event']).meta({
			description: 'Type of entity the asset is associated with',
			examples: ['place'],
		}),
		entityId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the associated entity',
				examples: ['place123'],
			}),
		url: z.url().meta({
			description: 'URL of the asset',
			examples: ['https://example.com/assets/image.jpg'],
		}),
		description: z
			.string()
			.max(512)
			.nullable()
			.meta({
				description: 'Description of the asset',
				examples: ['A beautiful view of the city skyline.'],
			}),
		order: z
			.number()
			.int()
			.min(0)
			.max(64)
			.meta({
				description:
					'Order of the asset among other assets for the same entity',
				examples: [0],
			}),
		createdAt: z.date().meta({
			description: 'Timestamp when the asset was created',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
		updatedAt: z.date().meta({
			description: 'Timestamp when the asset was last updated',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
	}).meta({
		description: 'An asset entity',
	}),
	follows: createSelectSchema(follows, {
		followerId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the follower user',
				examples: ['user123'],
			}),
		followingId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the following user',
				examples: ['user456'],
			}),
		createdAt: z.date().meta({
			description: 'Timestamp when the follow relationship was created',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
	}),
	category: createSelectSchema(categories, {
		id: z
			.number()
			.int()
			.min(1)
			.max(32767)
			.meta({
				description: 'Category ID',
				examples: [12],
			}),
		name: z
			.string()
			.min(1)
			.max(64)
			.meta({
				description: 'Name of the category',
				examples: ['Museums'],
			}),
		image: z
			.string()
			.min(1)
			.meta({
				description: 'Image URL of the category',
				examples: ['https://example.com/images/museums.jpg'],
			}),
	}).meta({
		description: 'A category entity',
	}),
	city: createSelectSchema(cities, {
		id: z
			.number()
			.int()
			.min(1)
			.max(2147483647)
			.meta({
				description: 'City ID',
				examples: [1024],
			}),
		name: z
			.string()
			.min(1)
			.max(128)
			.meta({
				description: 'Name of the city',
				examples: ['London'],
			}),
		stateCode: z
			.string()
			.min(1)
			.max(16)
			.meta({
				description: 'State code',
				examples: ['ENG'],
			}),
		stateName: z
			.string()
			.min(1)
			.max(64)
			.meta({
				description: 'State name',
				examples: ['England'],
			}),
		countryCode: z
			.string()
			.length(2)
			.meta({
				description: 'Country code',
				examples: ['GB'],
			}),
		countryName: z
			.string()
			.min(1)
			.max(64)
			.meta({
				description: 'Country name',
				examples: ['United Kingdom'],
			}),
		image: z
			.string()
			.min(1)
			.meta({
				description: 'Image URL of the city',
				examples: ['https://example.com/images/london.jpg'],
			}),
		lat: z
			.number()
			.min(-90)
			.max(90)
			.meta({
				description: 'Latitude',
				examples: [51.5074],
			}),
		lng: z
			.number()
			.min(-180)
			.max(180)
			.meta({
				description: 'Longitude',
				examples: [-0.1278],
			}),
		description: z
			.string()
			.min(1)
			.meta({
				description: 'Description of the city',
				examples: [
					'London is the capital city of the United Kingdom, known for its rich history and vibrant culture.',
				],
			}),
	}).meta({
		description: 'A city entity',
	}),
	address: createSelectSchema(addresses, {
		id: z
			.number()
			.int()
			.min(0)
			.max(2147483647)
			.meta({
				description: 'Address ID',
				examples: [2048],
			}),
		cityId: z
			.number()
			.int()
			.min(0)
			.max(2147483647)
			.meta({
				description: 'ID of the city associated with the address',
				examples: [1024],
			}),
		line1: z
			.string()
			.min(1)
			.max(256)
			.meta({
				description: 'First line of the address',
				examples: ['221B Baker Street'],
			}),
		line2: z
			.string()
			.max(256)
			.nullable()
			.meta({
				description: 'Second line of the address',
				examples: ['Apartment 2'],
			}),
		postalCode: z
			.string()
			.max(20)
			.nullable()
			.meta({
				description: 'Postal code of the address',
				examples: ['NW1 6XE'],
			}),
		lat: z
			.number()
			.min(-90)
			.max(90)
			.meta({
				description: 'Latitude of the address',
				examples: [51.5074],
			}),
		lng: z
			.number()
			.min(-180)
			.max(180)
			.meta({
				description: 'Longitude of the address',
				examples: [-0.1278],
			}),
	}),
	place: createSelectSchema(places, {
		id: z
			.string()
			.min(1)
			.meta({
				description: 'Place ID',
				examples: ['place123'],
			}),
		name: z
			.string()
			.min(1)
			.max(256)
			.meta({
				description: 'Name of the place',
				examples: ['The British Museum'],
			}),
		description: z
			.string()
			.min(1)
			.meta({
				description: 'Description of the place',
				examples: [
					'A world-famous museum showcasing art and artifacts from around the globe.',
				],
			}),
		phone: z
			.string()
			.max(32)
			.nullable()
			.meta({
				description: 'Contact phone number of the place',
				examples: ['+90 500 123 4567'],
			}),
		website: z
			.url()
			.nullable()
			.meta({
				description: 'Website URL of the place',
				examples: ['https://www.example.com'],
			}),
		addressId: z
			.number()
			.int()
			.min(0)
			.max(2147483647)
			.meta({
				description: 'ID of the address associated with the place',
				examples: [2048],
			}),
		categoryId: z
			.number()
			.int()
			.min(1)
			.max(32767)
			.meta({
				description: 'ID of the category associated with the place',
				examples: [12],
			}),
		priceLevel: z
			.number()
			.int()
			.min(1)
			.max(5)
			.meta({
				description: 'Price level of the place (1-5)',
				examples: [1, 2, 3, 4, 5],
			}),
		accessibilityLevel: z
			.number()
			.int()
			.min(1)
			.max(5)
			.meta({
				description: 'Accessibility level of the place (1-5)',
				examples: [1, 2, 3, 4, 5],
			}),
		totalVotes: z
			.number()
			.int()
			.min(0)
			.meta({
				description: 'Total number of votes the place has received',
				examples: [250],
			}),
		totalPoints: z
			.number()
			.int()
			.min(0)
			.meta({
				description: 'Total points accumulated from votes',
				examples: [1125],
			}),
		totalFavorites: z
			.number()
			.int()
			.min(0)
			.meta({
				description: 'Total number of times the place has been favorited',
				examples: [75],
			}),
		hours: z.record(z.string(), z.string()).meta({
			description: 'Operating hours of the place',
			examples: [
				{
					mon: '9:00 AM - 5:00 PM',
					tue: '9:00 AM - 5:00 PM',
					wed: '9:00 AM - 5:00 PM',
					thu: '9:00 AM - 5:00 PM',
					fri: '9:00 AM - 5:00 PM',
					sat: '10:00 AM - 6:00 PM',
					sun: 'Closed',
				},
			],
		}),
		amenities: z.array(z.string()).meta({
			description: 'List of amenities available at the place',
			examples: [['WiFi', 'Parking', 'Restrooms']],
		}),
		createdAt: z.date().meta({
			description: 'Timestamp when the place was created',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
		updatedAt: z.date().meta({
			description: 'Timestamp when the place was last updated',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
	}).meta({
		description: 'A place entity',
	}),
	bookmark: createSelectSchema(bookmarks, {
		id: z
			.number()
			.int()
			.meta({
				description: 'Bookmark ID',
				examples: [12345678901234],
			}),
		placeId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the bookmarked place',
				examples: ['place123'],
			}),
		userId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the user who created the bookmark',
				examples: ['user123'],
			}),
		createdAt: z.date().meta({
			description: 'Timestamp when the bookmark was created',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
	}).meta({
		description: 'A bookmark entity',
	}),
	favorite: createSelectSchema(favorites, {
		id: z
			.number()
			.int()
			.meta({
				description: 'Favorite ID',
				examples: [123456],
			}),
		placeId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the favorited place',
				examples: ['place123'],
			}),
		userId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the user who favorited the place',
				examples: ['user123'],
			}),
		createdAt: z.date().meta({
			description: 'Timestamp when the favorite was created',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
	}).meta({
		description: 'A favorite entity',
	}),
	collection: createSelectSchema(collections, {
		id: z
			.string()
			.min(1)
			.meta({
				description: 'Collection ID',
				examples: ['collection123'],
			}),
		name: z
			.string()
			.min(1)
			.max(256)
			.meta({
				description: 'Name of the collection',
				examples: ['My Favorite Places'],
			}),
		description: z
			.string()
			.min(1)
			.meta({
				description: 'Description of the collection',
				examples: ['A curated list of my favorite places to visit.'],
			}),
		createdAt: z.date().meta({
			description: 'Timestamp when the collection was created',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
	}).meta({
		description: 'A collection entity',
	}),
	collectionItem: createSelectSchema(collectionItems, {
		collectionId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the collection',
				examples: ['collection123'],
			}),
		placeId: z
			.string()
			.min(1)
			.meta({
				description: 'Place ID',
				examples: ['place123'],
			}),
		index: z
			.number()
			.int()
			.min(0)
			.meta({
				description: 'Index of the item within the collection',
				examples: [0],
			}),
		createdAt: z.date().meta({
			description: 'Timestamp when the collection item was created',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
	}).meta({
		description: 'A collection item entity',
	}),
	list: createSelectSchema(lists, {
		id: z
			.string()
			.min(1)
			.meta({
				description: 'List ID',
				examples: ['list123'],
			}),
		name: z
			.string()
			.min(1)
			.max(256)
			.meta({
				description: 'Name of the list',
				examples: ['London Attractions'],
			}),
		userId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the user who created the list',
				examples: ['user123'],
			}),
		isPublic: z.boolean().meta({
			description: 'Whether the list is public',
			examples: [true],
		}),
		createdAt: z.date().meta({
			description: 'Timestamp when the list was created',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
		updatedAt: z.date().meta({
			description: 'Timestamp when the list was last updated',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
	}).meta({
		description: 'A list entity',
	}),
	listItem: createSelectSchema(listItems, {
		listId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the list',
				examples: ['list123'],
			}),

		placeId: z
			.string()
			.min(1)
			.meta({
				description: 'Place ID',
				examples: ['place123'],
			}),
		index: z
			.number()
			.int()
			.min(0)
			.meta({
				description: 'Index of the item within the list',
				examples: [0],
			}),
		createdAt: z.date().meta({
			description: 'Timestamp when the list item was created',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
	}).meta({
		description: 'A list item entity',
	}),
	review: createSelectSchema(reviews, {
		id: z
			.string()
			.min(1)
			.meta({
				description: 'Review ID',
				examples: ['review123'],
			}),
		placeId: z
			.string()
			.min(1)
			.meta({
				description: 'Place ID',
				examples: ['place123'],
			}),
		userId: z
			.string()
			.min(1)
			.meta({
				description: 'User ID',
				examples: ['user123'],
			}),
		content: z
			.string()
			.min(1)
			.meta({
				description: 'Content of the review',
				examples: [
					'Amazing place! Had a wonderful time exploring the exhibits.',
				],
			}),
		rating: z
			.number()
			.min(1)
			.max(5)
			.meta({
				description: 'Rating given by the user',
				examples: [5],
			}),
		createdAt: z.date().meta({
			description: 'Timestamp when the review was created',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
		updatedAt: z.date().meta({
			description: 'Timestamp when the review was last updated',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
	}).meta({
		description: 'A review entity',
	}),
	trip: createSelectSchema(trips, {
		id: z
			.string()
			.min(1)
			.meta({
				description: 'Trip ID',
				examples: ['trip123'],
			}),
		ownerId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the user who owns the trip',
				examples: ['user123'],
			}),
		title: z
			.string()
			.min(1)
			.meta({
				description: 'Title of the trip',
				examples: ['Summer Vacation in Europe'],
			}),
		description: z
			.string()
			.min(1)
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
		startAt: z.date().meta({
			description: 'Start timestamp of the trip',
			examples: [new Date('2023-06-01T10:00:00Z')],
		}),
		endAt: z.date().meta({
			description: 'End timestamp of the trip',
			examples: [new Date('2023-06-15T18:00:00Z')],
		}),
		createdAt: z.date().meta({
			description: 'Timestamp when the trip was created',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
		updatedAt: z.date().meta({
			description: 'Timestamp when the trip was last updated',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
	}).meta({
		description: 'A trip entity',
	}),
	tripInvite: createSelectSchema(tripInvites, {
		id: z
			.string()
			.min(1)
			.meta({
				description: 'Trip Invite ID',
				examples: ['invite123'],
			}),
		tripId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the trip',
				examples: ['trip123'],
			}),
		fromId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the user who sent the invite',
				examples: ['user123'],
			}),
		toId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the user who received the invite',
				examples: ['user456'],
			}),
		sentAt: z.date().meta({
			description: 'Timestamp when the invite was sent',
			examples: [new Date('2023-05-01T12:00:00Z')],
		}),
		expiresAt: z.date().meta({
			description: 'Timestamp when the invite expires',
			examples: [new Date('2023-05-15T12:00:00Z')],
		}),
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
	}),
	tripComment: createSelectSchema(tripComments, {
		id: z
			.string()
			.min(1)
			.meta({
				description: 'Trip Comment ID',
				examples: ['comment123'],
			}),
		tripId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the trip',
				examples: ['trip123'],
			}),
		userId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the user who made the comment',
				examples: ['user123'],
			}),
		content: z
			.string()
			.min(1)
			.meta({
				description: 'Content of the comment',
				examples: ['Looking forward to this trip!'],
			}),
		createdAt: z.date().meta({
			description: 'Timestamp when the comment was created',
			examples: [new Date('2023-05-02T14:30:00Z')],
		}),
		updatedAt: z.date().meta({
			description: 'Timestamp when the comment was last updated',
			examples: [new Date('2023-05-02T14:30:00Z')],
		}),
	}).meta({
		description: 'A trip comment entity',
	}),
	tripLocation: createSelectSchema(tripLocations, {
		id: z
			.string()
			.min(1)
			.meta({
				description: 'Trip Location ID',
				examples: ['location123'],
			}),
		tripId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the trip',
				examples: ['trip123'],
			}),
		scheduledTime: z.date().meta({
			description: 'Scheduled time for the location visit',
			examples: [new Date('2023-06-05T10:00:00Z')],
		}),
		placeId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the place',
				examples: ['place123'],
			}),
		description: z
			.string()
			.min(1)
			.meta({
				description: 'Description of the location',
				examples: ['Eiffel Tower'],
			}),
	}).meta({
		description: 'A trip location entity',
	}),
	tripParticipant: createSelectSchema(tripParticipants, {
		id: z
			.string()
			.min(1)
			.meta({
				description: 'Trip Participant ID',
				examples: ['participant123'],
			}),
		tripId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the trip',
				examples: ['trip123'],
			}),
		userId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the user',
				examples: ['user123'],
			}),
		role: z.enum(['member', 'editor']).meta({
			description: 'Role of the participant in the trip',
			examples: ['member'],
		}),
	}).meta({
		description: 'A trip participant entity',
	}),
	userTopPlaces: createSelectSchema(userTopPlaces, {
		userId: z
			.string()
			.min(1)
			.meta({
				description: 'User ID',
				examples: ['user123'],
			}),
		placeId: z
			.string()
			.min(1)
			.meta({
				description: 'Place ID',
				examples: ['place123'],
			}),
		index: z
			.number()
			.min(0)
			.meta({
				description: "Index of the place in the user's top places",
				examples: [0],
			}),
	}).meta({
		description: 'A user top places entity',
	}),
	report: createSelectSchema(reports, {
		id: z
			.string()
			.min(1)
			.meta({
				description: 'Report ID',
				examples: ['report123'],
			}),
		resourceId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the reported resource',
				examples: ['place123'],
			}),
		resourceType: z
			.string()
			.min(1)
			.meta({
				description: 'Type of the reported resource',
				examples: ['place', 'review', 'comment', 'user'],
			}),
		reporterId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the user who reported the resource',
				examples: ['user123'],
			}),
		reason: z
			.number()
			.int()
			.min(1)
			.max(32)
			.meta({
				description: 'Reason for reporting the resource',
				examples: ['Inappropriate content'],
			}),
		description: z
			.string()
			.min(1)
			.max(2048)
			.nullable()
			.meta({
				description: 'Additional description provided by the reporter',
				examples: ['The content contains offensive language.'],
			}),
		resolved: z.boolean().meta({
			description: 'Whether the report has been resolved',
			examples: [false],
		}),
		resolvedAt: z
			.date()
			.nullable()
			.meta({
				description: 'Timestamp when the report was resolved',
				examples: [null],
			}),
		createdAt: z.date().meta({
			description: 'Timestamp when the report was created',
			examples: [new Date('2023-05-10T09:00:00Z')],
		}),
		updatedAt: z.date().meta({
			description: 'Timestamp when the report was last updated',
			examples: [new Date('2023-05-10T09:00:00Z')],
		}),
	}).meta({
		description: 'A report entity',
	}),
	event: createSelectSchema(events, {
		id: z
			.string()
			.min(1)
			.meta({
				description: 'Event ID',
				examples: ['event123'],
			}),
		title: z
			.string()
			.min(1)
			.max(256)
			.meta({
				description: 'Title of the event',
				examples: ['Music Festival'],
			}),
		startsAt: z.date().meta({
			description: 'Start timestamp of the event',
			examples: [new Date('2023-07-01T18:00:00Z')],
		}),
		endsAt: z.date().meta({
			description: 'End timestamp of the event',
			examples: [new Date('2023-07-01T23:00:00Z')],
		}),
		addressId: z
			.number()
			.int()
			.min(0)
			.max(2147483647)
			.meta({
				description: 'ID of the address where the event is held',
				examples: [2048],
			}),
		description: z
			.string()
			.min(1)
			.meta({
				description: 'Description of the event',
				examples: ['An exciting music festival featuring various artists.'],
			}),
		organizerId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the user organizing the event',
				examples: ['user123'],
			}),
		externalUrl: z
			.url()
			.nullable()
			.meta({
				description: 'External URL for more information about the event',
				examples: ['https://www.example.com/events/music-festival'],
			}),
		ageRestriction: z.enum(['4+', '9+', '13+', '16+', '18+', 'unrated']).meta({
			description: 'Age restriction for the event',
			examples: ['13+'],
		}),
		amenities: z.array(z.string()).meta({
			description: 'List of amenities available at the event',
			examples: [['Parking', 'Restrooms', 'Food Stalls']],
		}),
		refundPolicy: z
			.enum([
				'full-refund',
				'partial-refund',
				'no-refund',
				'conditional',
				'unspecified',
			])
			.meta({
				description: 'Refund policy for the event',
				examples: ['full-refund'],
			}),
		faq: z.record(z.string(), z.string()).meta({
			description: 'Frequently asked questions about the event',
			examples: [
				{
					'What is the dress code?':
						'Casual attire is recommended for the event.',
					'Are pets allowed?': 'No, pets are not allowed at the event.',
				},
			],
		}),
		placeId: z
			.string()
			.min(1)
			.nullable()
			.meta({
				description: 'ID of the place associated with the event',
				examples: ['place123'],
			}),
		isOnline: z.boolean().meta({
			description: 'Whether the event is held online',
			examples: [false],
		}),
		recurrence: z
			.enum([
				'no-recurrence',
				'daily',
				'weekly',
				'monthly',
				'annually',
				'seasonal',
				'unspecified',
			])
			.meta({
				description: 'Recurrence pattern of the event',
				examples: ['no-recurrence'],
			}),
		categories: z.array(z.string()).meta({
			description: 'List of categories associated with the event',
			examples: [['Music', 'Festival']],
		}),
		createdAt: z.date().meta({
			description: 'Timestamp when the event was created',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
		updatedAt: z.date().meta({
			description: 'Timestamp when the event was last updated',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
	}).meta({
		description: 'An event entity',
	}),
	eventTicketOption: createSelectSchema(eventTicketOptions, {
		id: z
			.string()
			.min(1)
			.meta({
				description: 'Event Ticket Option ID',
				examples: ['ticketoption123'],
			}),
		eventId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the event',
				examples: ['event123'],
			}),
		name: z
			.string()
			.min(1)
			.max(128)
			.meta({
				description: 'Name of the ticket option',
				examples: ['General Admission'],
			}),
		description: z
			.string()
			.min(1)
			.meta({
				description: 'Description of the ticket option',
				examples: ['Access to the event for one day with no reserved seating.'],
			}),
		fee: z
			.number()
			.min(0)
			.int()
			.meta({
				description:
					"Fee for the ticket option. It's in the lowest denomination of the currency (e.g., cents).",
				examples: [500],
			}),
		currency: z
			.string()
			.length(3)
			.meta({
				description: 'Currency code for the ticket fee (ISO 4217 format)',
				examples: ['USD'],
			}),
		totalAvailability: z
			.number()
			.int()
			.min(0)
			.meta({
				description: 'Total number of tickets available for this option',
				examples: [100],
			}),
		currentAvailability: z
			.number()
			.int()
			.min(0)
			.meta({
				description: 'Current number of tickets available for this option',
				examples: [75],
			}),
		createdAt: z.date().meta({
			description: 'Timestamp when the ticket option was created',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
		updatedAt: z.date().meta({
			description: 'Timestamp when the ticket option was last updated',
			examples: [new Date('2023-01-15T10:00:00Z')],
		}),
	}).meta({
		description: 'An event ticket option entity',
	}),
	eventAgendaItem: createSelectSchema(eventAgendaItems, {
		id: z
			.string()
			.min(1)
			.meta({
				description: 'Event Agenda Item ID',
				examples: ['agendaitem123'],
			}),
		eventId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the event',
				examples: ['event123'],
			}),
		startsAt: z.date().meta({
			description: 'Start timestamp of the agenda item',
			examples: [new Date('2023-07-01T18:00:00Z')],
		}),
		endsAt: z.date().meta({
			description: 'End timestamp of the agenda item',
			examples: [new Date('2023-07-01T19:00:00Z')],
		}),
		title: z
			.string()
			.min(1)
			.max(256)
			.meta({
				description: 'Title of the agenda item',
				examples: ['Opening Ceremony'],
			}),
		description: z
			.string()
			.min(1)
			.nullable()
			.meta({
				description: 'Description of the agenda item',
				examples: [
					'The official opening ceremony of the event with speeches and performances.',
				],
			}),
	}).meta({
		description: 'An event agenda item entity',
	}),
	eventInterest: createSelectSchema(eventInterests),
	eventLineupItem: createSelectSchema(eventLineupItems, {
		id: z
			.string()
			.min(1)
			.meta({
				description: 'Event Lineup Item ID',
				examples: ['lineupitem123'],
			}),
		eventId: z
			.string()
			.min(1)
			.meta({
				description: 'ID of the event',
				examples: ['event123'],
			}),
		name: z
			.string()
			.min(1)
			.max(256)
			.meta({
				description: 'Name of the speaker or performer',
				examples: ['John Doe'],
			}),
		userId: z
			.string()
			.min(1)
			.nullable()
			.meta({
				description:
					'ID of the user if the lineup item is associated with a user',
				examples: ['user123'],
			}),
		badge: z
			.string()
			.max(128)
			.meta({
				description: 'Badge associated with the lineup item',
				examples: ['Keynote Speaker'],
			}),
		title: z
			.string()
			.max(256)
			.nullable()
			.meta({
				description: 'Title or role of the lineup item',
				examples: ['CEO of Example Corp'],
			}),
		description: z
			.string()
			.min(1)
			.nullable()
			.meta({
				description: 'Description of the lineup item',
				examples: [
					'John Doe will be delivering the keynote address on innovation in technology.',
				],
			}),
		order: z
			.number()
			.int()
			.min(1)
			.meta({
				description: 'Order of the lineup item in the event schedule',
				examples: [1],
			}),
	}).meta({
		description: 'An event lineup item entity',
	}),
	notification: z
		.object({
			id: z
				.string()
				.min(1)
				.meta({
					description: 'Notification ID',
					examples: ['n123'],
				}),
			recipientId: z
				.string()
				.min(1)
				.meta({
					description: 'Recipient ID',
					examples: ['u123'],
				}),
			actorId: z
				.string()
				.min(1)
				.nullable()
				.meta({
					description: 'Actor ID',
					examples: ['u123'],
				}),
			type: z
				.string()
				.min(1)
				.meta({
					description: 'Notification type',
					examples: [
						'user_follow',
						'trip_add_user',
						'trip_update',
						'trip_invite',
						'trip_add_comment',
						'wl_event_suggest',
						'wl_list_suggest',
					],
				}),
			entityType: z
				.string()
				.min(1)
				.meta({
					description: 'Entity type',
					examples: ['place', 'trip', 'user'],
				}),
			entityId: z
				.string()
				.min(1)
				.meta({
					description: 'Entity ID',
					examples: ['p123', 't123', 'u123'],
				}),
			data: z.object({}).nullable().meta({
				description: 'Notification data',
			}),
			readAt: z.date().nullable().meta({
				description: 'Read at',
			}),
			createdAt: z.date().meta({
				description: 'Created at',
			}),
		})
		.meta({
			description: 'A notification entity',
		}),
};

export const $insert = {
	user: createInsertSchema(users),
	account: createInsertSchema(accounts),
	asset: createInsertSchema(assets),
	follows: createInsertSchema(follows),
	category: createInsertSchema(categories),
	city: createInsertSchema(cities),
	address: createInsertSchema(addresses),
	place: createInsertSchema(places),
	bookmark: createInsertSchema(bookmarks),
	favorite: createInsertSchema(favorites),
	collection: createInsertSchema(collections),
	collectionItem: createInsertSchema(collectionItems),
	collectionsCities: createInsertSchema(collectionsCities),
	collectionsPlaces: createInsertSchema(collectionsPlaces),
	list: createInsertSchema(lists),
	listItem: createInsertSchema(listItems),
	review: createInsertSchema(reviews),
	trip: createInsertSchema(trips),
	tripInvite: createInsertSchema(tripInvites),
	tripComment: createInsertSchema(tripComments),
	tripLocation: createInsertSchema(tripLocations),
	tripParticipant: createInsertSchema(tripParticipants),
	userTopPlaces: createInsertSchema(userTopPlaces),
	report: createInsertSchema(reports),
	event: createInsertSchema(events),
	eventTicketOption: createInsertSchema(eventTicketOptions),
	eventAgendaItem: createInsertSchema(eventAgendaItems),
	eventLineupItem: createInsertSchema(eventLineupItems),
	eventInterest: createInsertSchema(eventInterests),
	notification: z.object({
		recipientId: z.string().min(1),
		actorId: z.string().min(1).nullable(),
		type: z.enum([
			'user_follow',
			'trip_add_user',
			'trip_update',
			'trip_invite',
			'trip_add_comment',
			'wl_event_suggest',
			'wl_list_suggest',
		]),
		entityType: z.enum(['place', 'trip', 'user']),
		entityId: z.string().min(1),
		data: z.object({}).nullable(),
	}),
};
