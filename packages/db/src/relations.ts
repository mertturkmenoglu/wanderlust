import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
	accolades: {},
	accoladeAssignments: {
		place: r.one.places({
			from: r.accoladeAssignments.placeId,
			to: r.places.id,
			optional: false,
		}),
		accolade: r.one.accolades({
			from: r.accoladeAssignments.accoladeId,
			to: r.accolades.id,
			optional: false,
		}),
	},
	addresses: {
		city: r.one.cities({
			from: r.addresses.cityId,
			to: r.cities.id,
			optional: false,
		}),
	},
	assets: {
		review: r.one.reviews({
			from: r.assets.entityId,
			to: r.reviews.id,
		}),
		place: r.one.places({
			from: r.assets.entityId,
			to: r.places.id,
		}),
		event: r.one.events({
			from: r.assets.entityId,
			to: r.events.id,
		}),
	},
	bookmarks: {
		place: r.one.places({
			from: r.bookmarks.placeId,
			to: r.places.id,
			optional: false,
		}),
		user: r.one.users({
			from: r.bookmarks.userId,
			to: r.users.id,
			optional: false,
		}),
	},
	favorites: {
		place: r.one.places({
			from: r.favorites.placeId,
			to: r.places.id,
			optional: false,
		}),
		user: r.one.users({
			from: r.favorites.userId,
			to: r.users.id,
			optional: false,
		}),
	},
	reviews: {
		place: r.one.places({
			from: r.reviews.placeId,
			to: r.places.id,
			optional: false,
		}),
		user: r.one.users({
			from: r.reviews.userId,
			to: r.users.id,
			optional: false,
		}),
		assets: r.many.assets(),
	},
	users: {
		bookmarks: r.many.bookmarks(),
		favorites: r.many.favorites(),
		lists: r.many.lists(),
		reviews: r.many.reviews(),
		trips: r.many.trips(),
		topPlaces: r.many.userTopPlaces(),
		eventInterests: r.many.eventInterests(),
		createdChats: r.many.chats({
			from: r.users.id,
			to: r.chats.creatorId,
			alias: 'createdChats',
		}),
		chats: r.many.chatParticipants({
			from: r.users.id,
			to: r.chatParticipants.userId,
			alias: 'chats',
		}),
	},
	follows: {
		follower: r.one.users({
			from: r.follows.followerId,
			to: r.users.id,
			optional: false,
		}),
		following: r.one.users({
			from: r.follows.followingId,
			to: r.users.id,
			optional: false,
		}),
	},
	places: {
		accolades: r.many.accoladeAssignments(),
		address: r.one.addresses({
			from: r.places.addressId,
			to: r.addresses.id,
			optional: false,
		}),
		category: r.one.categories({
			from: r.places.categoryId,
			to: r.categories.id,
			optional: false,
		}),
		assets: r.many.assets(),
	},
	events: {
		address: r.one.addresses({
			from: r.events.addressId,
			to: r.addresses.id,
			optional: false,
		}),
		organizer: r.one.users({
			from: r.events.organizerId,
			to: r.users.id,
			optional: false,
		}),
		assets: r.many.assets(),
		ticketOptions: r.many.eventTicketOptions(),
		agenda: r.many.eventAgendaItems(),
		lineup: r.many.eventLineupItems(),
		interests: r.many.eventInterests(),
		place: r.one.places({
			from: r.events.placeId,
			to: r.places.id,
			optional: true,
		}),
	},
	eventTicketOptions: {
		event: r.one.events({
			from: r.eventTicketOptions.eventId,
			to: r.events.id,
			optional: false,
		}),
	},
	eventAgendaItems: {
		event: r.one.events({
			from: r.eventAgendaItems.eventId,
			to: r.events.id,
			optional: false,
		}),
	},
	eventLineupItems: {
		event: r.one.events({
			from: r.eventLineupItems.eventId,
			to: r.events.id,
			optional: false,
		}),
		user: r.one.users({
			from: r.eventLineupItems.userId,
			to: r.users.id,
			optional: true,
		}),
	},
	collections: {
		items: r.many.collectionItems(),
	},
	collectionItems: {
		collection: r.one.collections({
			from: r.collectionItems.collectionId,
			to: r.collections.id,
			optional: false,
		}),
		place: r.one.places({
			from: r.collectionItems.placeId,
			to: r.places.id,
			optional: false,
		}),
	},
	collectionsPlaces: {
		collection: r.one.collections({
			from: r.collectionsPlaces.collectionId,
			to: r.collections.id,
			optional: false,
		}),
		place: r.one.places({
			from: r.collectionsPlaces.placeId,
			to: r.places.id,
			optional: false,
		}),
	},
	collectionsCities: {
		collection: r.one.collections({
			from: r.collectionsCities.collectionId,
			to: r.collections.id,
			optional: false,
		}),
		city: r.one.cities({
			from: r.collectionsCities.cityId,
			to: r.cities.id,
			optional: false,
		}),
	},
	listItems: {
		list: r.one.lists({
			from: r.listItems.listId,
			to: r.lists.id,
			optional: false,
		}),
		place: r.one.places({
			from: r.listItems.placeId,
			to: r.places.id,
			optional: false,
		}),
	},
	tripInvites: {
		trip: r.one.trips({
			from: r.tripInvites.tripId,
			to: r.trips.id,
			optional: false,
		}),
		fromUser: r.one.users({
			from: r.tripInvites.fromId,
			to: r.users.id,
			optional: false,
		}),
		toUser: r.one.users({
			from: r.tripInvites.toId,
			to: r.users.id,
			optional: false,
		}),
	},
	tripComments: {
		trip: r.one.trips({
			from: r.tripComments.tripId,
			to: r.trips.id,
			optional: false,
		}),
		user: r.one.users({
			from: r.tripComments.userId,
			to: r.users.id,
			optional: false,
		}),
	},
	lists: {
		items: r.many.listItems(),
		user: r.one.users({
			from: r.lists.userId,
			to: r.users.id,
			optional: false,
		}),
	},
	trips: {
		participants: r.many.tripParticipants(),
		invites: r.many.tripInvites(),
		locations: r.many.tripLocations(),
		comments: r.many.tripComments(),
		owner: r.one.users({
			from: r.trips.ownerId,
			to: r.users.id,
			optional: false,
		}),
	},
	tripParticipants: {
		trip: r.one.trips({
			from: r.tripParticipants.tripId,
			to: r.trips.id,
			optional: false,
		}),
		user: r.one.users({
			from: r.tripParticipants.userId,
			to: r.users.id,
			optional: false,
		}),
	},
	tripLocations: {
		trip: r.one.trips({
			from: r.tripLocations.tripId,
			to: r.trips.id,
			optional: false,
		}),
		place: r.one.places({
			from: r.tripLocations.placeId,
			to: r.places.id,
			optional: false,
		}),
	},
	messageAttachments: {
		message: r.one.messages({
			from: r.messageAttachments.messageId,
			to: r.messages.id,
			optional: false,
		}),
	},
	messageSharedEntities: {
		message: r.one.messages({
			from: r.messageSharedEntities.messageId,
			to: r.messages.id,
			optional: false,
		}),
	},
	messageDeletions: {
		message: r.one.messages({
			from: r.messageDeletions.messageId,
			to: r.messages.id,
			optional: false,
		}),
		user: r.one.users({
			from: r.messageDeletions.userId,
			to: r.users.id,
			optional: false,
		}),
	},
	messageReactions: {
		message: r.one.messages({
			from: r.messageReactions.messageId,
			to: r.messages.id,
			optional: false,
		}),
		user: r.one.users({
			from: r.messageReactions.userId,
			to: r.users.id,
			optional: false,
		}),
	},
	userTopPlaces: {
		user: r.one.users({
			from: r.userTopPlaces.userId,
			to: r.users.id,
			optional: false,
		}),
		place: r.one.places({
			from: r.userTopPlaces.placeId,
			to: r.places.id,
			optional: false,
		}),
	},
	eventInterests: {
		event: r.one.events({
			from: r.eventInterests.eventId,
			to: r.events.id,
			optional: false,
		}),
		user: r.one.users({
			from: r.eventInterests.userId,
			to: r.users.id,
			optional: false,
		}),
	},
	messages: {
		chat: r.one.chats({
			from: r.messages.chatId,
			to: r.chats.id,
			alias: 'chatMessages',
			optional: false,
		}),
		sender: r.one.users({
			from: r.messages.senderId,
			to: r.users.id,
			alias: 'messageSender',
			optional: false,
		}),
		deletedBy: r.one.users({
			from: r.messages.deletedById,
			to: r.users.id,
			alias: 'messageDeletedBy',
		}),
		replyTo: r.one.messages({
			from: r.messages.replyToMessageId,
			to: r.messages.id,
			alias: 'replyTo',
		}),
		replies: r.many.messages({
			alias: 'replyTo',
		}),
		attachments: r.many.messageAttachments(),
		sharedEntity: r.one.messageSharedEntities(),
		deletions: r.many.messageDeletions(),
		reactions: r.many.messageReactions(),
	},
	chats: {
		creator: r.one.users({
			from: r.chats.creatorId,
			to: r.users.id,
			alias: 'chatCreator',
			optional: false,
		}),
		pinnedBy: r.one.users({
			from: r.chats.pinnedById,
			to: r.users.id,
			alias: 'chatPinnedBy',
		}),
		pinnedMessage: r.one.messages({
			from: r.chats.pinnedMessageId,
			to: r.messages.id,
			alias: 'chatPinnedMessage',
		}),
		lastMessage: r.one.messages({
			from: r.chats.lastMessageId,
			to: r.messages.id,
			alias: 'chatLastMessage',
		}),
		participants: r.many.chatParticipants(),
		messages: r.many.messages({
			alias: 'chatMessages',
		}),
	},
	chatParticipants: {
		chat: r.one.chats({
			from: r.chatParticipants.chatId,
			to: r.chats.id,
			optional: false,
		}),
		user: r.one.users({
			from: r.chatParticipants.userId,
			to: r.users.id,
			alias: 'participantUser',
			optional: false,
		}),
		invitedBy: r.one.users({
			from: r.chatParticipants.invitedById,
			to: r.users.id,
			alias: 'participantInvitedBy',
			optional: false,
		}),
		lastReadMessage: r.one.messages({
			from: r.chatParticipants.lastReadMessageId,
			to: r.messages.id,
			optional: false,
		}),
	},
	notifications: {
		recipient: r.one.users({
			from: r.notifications.recipientId,
			to: r.users.id,
			optional: false,
		}),
		review: r.one.reviews({
			from: r.notifications.entityId,
			to: r.reviews.id,
			optional: true,
		}),
		place: r.one.places({
			from: r.notifications.entityId,
			to: r.places.id,
			optional: true,
		}),
		event: r.one.events({
			from: r.notifications.entityId,
			to: r.events.id,
			optional: true,
		}),
		list: r.one.lists({
			from: r.notifications.entityId,
			to: r.lists.id,
			optional: true,
		}),
		trip: r.one.trips({
			from: r.notifications.entityId,
			to: r.trips.id,
			optional: true,
		}),
		user: r.one.users({
			from: r.notifications.entityId,
			to: r.users.id,
			optional: true,
		}),
	},
	notificationPreferences: {
		user: r.one.users({
			from: r.notificationPreferences.userId,
			to: r.users.id,
			optional: false,
		}),
	},
}));
