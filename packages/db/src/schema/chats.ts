import * as p from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm/sql';
import { users } from './auth';

export const chatType = p.pgEnum('chat_type', ['direct', 'group']);

export const chatParticipantRole = p.pgEnum('chat_participant_role', [
	'member',
	'admin',
]);

export const messageType = p.pgEnum('message_type', [
	'text', // text only
	'media', // text? + media+ attachments,
	'audio', // audio only
	'sticker', // text? + sticker
	'gif', // text? + gif
	'share', // text? + entity,
	'system', // system message only
]);

export const messageAttachmentType = p.pgEnum('message_attachment_type', [
	'image',
	'video',
	'audio',
]);

export const chatSharedEntityType = p.pgEnum('chat_shared_entity_type', [
	'place',
	'review',
	'event',
	'list',
	'trip',
	'user',
]);

export const chatSystemEventType = p.pgEnum('chat_system_event_type', [
	'conversation_created',
	'member_joined',
	'member_added',
	'member_removed',
	'member_left',
	'role_granted',
	'role_revoked',
	'renamed',
	'description_changed',
	'image_changed',
	'message_pinned',
	'message_unpinned',
]);

export type TMessageMetadata = {
	linkPreview?: {
		url: string;
		title?: string;
		description?: string;
		imageUrl?: string;
		siteName?: string;
	};
	sticker?: {
		id: string;
		packId?: string;
		url: string;
	};
	gif?: {
		provider: 'giphy' | 'tenor';
		id: string;
		url: string;
		width: number;
		height: number;
	};
	// Arbitrary payload for `system` messages (e.g. { targetUserId, oldName })
	system?: Record<string, unknown>;
};

export const chats = p.pgTable(
	'chats',
	{
		id: p
			.uuid()
			.primaryKey()
			.$defaultFn(() => Bun.randomUUIDv7()),
		type: chatType().notNull(),

		// These fields are for group chats only
		name: p.text(), // optional, should be null for direct chats
		description: p.text(),
		imageUrl: p.text(),

		creatorId: p.text().references(() => users.id, { onDelete: 'set null' }),

		// Pinned message
		pinnedMessageId: p.uuid().references((): p.AnyPgColumn => messages.id, {
			onDelete: 'set null',
		}),
		pinnedById: p.text().references(() => users.id, { onDelete: 'set null' }),
		pinnedAt: p.timestamp({ withTimezone: true }),

		// Denormalized last message info for quick access
		lastMessageId: p.uuid().references((): p.AnyPgColumn => messages.id, {
			onDelete: 'set null',
		}),
		lastMessageAt: p.timestamp({ withTimezone: true }),

		// Stored as "minUserId:maxUserId" for direct chats, null for group chats
		// This is used to enforce uniqueness of direct chats between two users
		// Multiple nulls are allowed for unique indexes in Postgres.
		directKey: p.text(),

		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: p
			.timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(t) => [p.uniqueIndex().on(t.directKey), p.index().on(t.lastMessageAt)],
);

export const chatParticipants = p.pgTable(
	'chat_participants',
	{
		id: p
			.uuid()
			.primaryKey()
			.$defaultFn(() => Bun.randomUUIDv7()),
		chatId: p
			.uuid()
			.notNull()
			.references(() => chats.id, { onDelete: 'cascade' }),
		userId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		role: chatParticipantRole().notNull().default('member'),

		joinedAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		leftAt: p.timestamp({ withTimezone: true }),
		invitedById: p.text().references(() => users.id, { onDelete: 'set null' }),

		lastReadMessageId: p.uuid().references((): p.AnyPgColumn => messages.id, {
			onDelete: 'set null',
		}),
		lastReadAt: p.timestamp({ withTimezone: true }),

		mutedUntil: p.timestamp({ withTimezone: true }),
		clearedAt: p.timestamp({ withTimezone: true }),

		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: p
			.timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(t) => [
		p.uniqueIndex().on(t.chatId, t.userId),
		p.index().on(t.userId),
		p.index().on(t.chatId),
	],
);

export const messages = p.pgTable(
	'messagees',
	{
		id: p
			.uuid()
			.primaryKey()
			.$defaultFn(() => Bun.randomUUIDv7()),
		chatId: p
			.uuid()
			.notNull()
			.references(() => chats.id, { onDelete: 'cascade' }),
		senderId: p.text().references(() => users.id, { onDelete: 'set null' }),
		type: messageType().notNull().default('text'),
		body: p.text(),
		replyToMessageId: p.uuid().references((): p.AnyPgColumn => messages.id, {
			onDelete: 'set null',
		}),
		systemEvent: chatSystemEventType(),
		metadata: p.jsonb().$type<TMessageMetadata>(),
		editedAt: p.timestamp({ withTimezone: true }),
		deletedAt: p.timestamp({ withTimezone: true }),
		deletedById: p.text().references(() => users.id, { onDelete: 'set null' }),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: p
			.timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(t) => [
		p.index().on(t.chatId, t.id),
		p.index().on(t.replyToMessageId),
		p.check(
			'check_messages_audio_body',
			sql`${t.type} <> 'audio' OR ${t.body} IS NOT NULL`,
		),
	],
);

export const messageAttachments = p.pgTable(
	'message_attachments',
	{
		id: p
			.uuid()
			.primaryKey()
			.$defaultFn(() => Bun.randomUUIDv7()),
		messageId: p
			.uuid()
			.notNull()
			.references(() => messages.id, { onDelete: 'cascade' }),
		type: messageAttachmentType().notNull(),

		storageKey: p.text().notNull(),
		url: p.text().notNull(),
		caption: p.text(),

		mimeType: p.text(),
		sizeBytes: p.bigint({ mode: 'number' }),
		width: p.integer(),
		height: p.integer(),
		durationMs: p.integer(),
		thumbnailKey: p.text(),
		blurhash: p.text(),

		sortOrder: p.integer().notNull().default(0),

		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(t) => [p.index().on(t.messageId)],
);

export const messageSharedEntities = p.pgTable(
	'message_shared_entities',
	{
		id: p
			.uuid()
			.primaryKey()
			.$defaultFn(() => Bun.randomUUIDv7()),
		messageId: p
			.uuid()
			.notNull()
			.references(() => messages.id, { onDelete: 'cascade' }),
		entityType: chatSharedEntityType().notNull(),
		entityId: p.text().notNull(),
		snapshot: p.jsonb().$type<Record<string, unknown>>(),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(t) => [p.index().on(t.messageId), p.index().on(t.entityType, t.entityId)],
);

export const messageDeletions = p.pgTable(
	'message_deletions',
	{
		messageId: p
			.uuid()
			.notNull()
			.references(() => messages.id, { onDelete: 'cascade' }),
		userId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(t) => [p.primaryKey({ columns: [t.messageId, t.userId] })],
);

export const messageReactions = p.pgTable(
	'message_reactions',
	{
		messageId: p
			.uuid()
			.notNull()
			.references(() => messages.id, { onDelete: 'cascade' }),
		userId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		emoji: p.text().notNull(),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(t) => [
		p.primaryKey({ columns: [t.messageId, t.userId, t.emoji] }),
		p.index().on(t.messageId),
	],
);
