import { relations } from 'drizzle-orm';
import {
  bigint,
  boolean,
  index,
  json,
  pgTable,
  smallint,
  smallserial,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  username: text('username').notNull().unique(),
  image: text('image'),
  isBusinessAccount: boolean('is_business_account').notNull().default(false),
  isVerified: boolean('is_verified').notNull().default(false),
  bio: varchar('bio', { length: 255 }),
  website: text('website'),
  phone: text('phone'),
  followersCount: bigint('followers_count', { mode: 'number' })
    .notNull()
    .default(0),
  followingCount: bigint('following_count', { mode: 'number' })
    .notNull()
    .default(0),
});

export type User = typeof users.$inferSelect;

export const follows = pgTable(
  'follows',
  {
    followerId: uuid('follower_id')
      .notNull()
      .references(() => users.id),
    followingId: uuid('following_id')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      followsFollowerIdx: index('follows_follower_idx').on(table.followerId),
      followsFollowingIdx: index('follows_following_idx').on(table.followingId),
      uniqueFollows: unique().on(table.followerId, table.followingId),
    };
  }
);

export const auths = pgTable('auths', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email'),
  emailId: text('email_id'),
  emailVerification: text('email_verification'),
  lastSignInAt: bigint('last_sign_in_at', { mode: 'number' }),
  createdAt: bigint('created_at', { mode: 'number' }),
  updatedAt: bigint('updated_at', { mode: 'number' }),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull()
    .unique(),
});

export type AuthUser = typeof auths.$inferSelect;

export type Address = {
  country: string;
  city: string;
  line1: string;
  line2: string | null;
  postalCode: string | null;
  state: string | null;
  lat: number;
  long: number;
};

export const locations = pgTable(
  'locations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    phone: text('phone'),
    address: json('address').$type<Address>().notNull(),
    website: text('website'),
    priceLevel: smallint('price_level').notNull().default(1),
    accessibilityLevel: smallint('accessibility_level').notNull().default(1),
    hasWifi: boolean('has_wifi').notNull().default(false),
    tags: json('tags').$type<string[]>().notNull().default([]),
    categoryId: smallserial('category_id')
      .notNull()
      .references(() => categories.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      locationsCategoryIdx: index('locations_category_idx').on(
        table.categoryId
      ),
    };
  }
);

export const locationsRelations = relations(locations, ({ one }) => ({
  category: one(categories, {
    fields: [locations.categoryId],
    references: [categories.id],
  }),
}));

export type Location = typeof locations.$inferSelect;

export const events = pgTable(
  'events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    organizerId: uuid('organizer_id')
      .notNull()
      .references(() => users.id),
    address: json('address').$type<Address>().notNull(),
    description: text('description').notNull(),
    startsAt: timestamp('starts_at').notNull(),
    endsAt: timestamp('ends_at').notNull(),
    website: text('website'),
    priceLevel: smallint('price_level').notNull().default(1),
    accessibilityLevel: smallint('accessibility_level').notNull().default(1),
    tags: json('tags').$type<string[]>().default([]),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      eventsOrganizerIdx: index('events_organizer_idx').on(table.organizerId),
    };
  }
);

export const eventsRelations = relations(events, ({ one }) => ({
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id],
  }),
}));

export const categories = pgTable('categories', {
  id: smallserial('id').primaryKey(),
  name: text('name').notNull(),
});

export const bookmarks = pgTable(
  'bookmarks',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    locationId: uuid('location_id')
      .notNull()
      .references(() => locations.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      bookmarksUserIdx: index('bookmarks_user_idx').on(table.userId),
      uniqueBookmarks: unique().on(table.userId, table.locationId),
    };
  }
);

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
  location: one(locations, {
    fields: [bookmarks.locationId],
    references: [locations.id],
  }),
}));

export const lists = pgTable(
  'lists',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    isPublic: boolean('is_public').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      listsUserIdx: index('lists_user_idx').on(table.userId),
    };
  }
);

export const listsRelations = relations(lists, ({ one }) => ({
  user: one(users, {
    fields: [lists.userId],
    references: [users.id],
  }),
}));

export const listItems = pgTable(
  'list_items',
  {
    listId: uuid('list_id')
      .notNull()
      .references(() => lists.id),
    locationId: uuid('location_id')
      .notNull()
      .references(() => locations.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      listItemsListIdx: index('list_items_list_idx').on(table.listId),
      uniqueListItems: unique().on(table.listId, table.locationId),
    };
  }
);

export const listItemsRelations = relations(listItems, ({ one }) => ({
  list: one(lists, {
    fields: [listItems.listId],
    references: [lists.id],
  }),
  location: one(locations, {
    fields: [listItems.locationId],
    references: [locations.id],
  }),
}));
