import { relations } from 'drizzle-orm';
import {
  bigint,
  boolean,
  doublePrecision,
  index,
  integer,
  json,
  pgEnum,
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
  pronouns: varchar('pronouns', { length: 32 }),
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

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
  }),
}));

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

export type Media = {
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  alt: string;
  caption: string | null;
  width: number;
  height: number;
};

export const locations = pgTable(
  'locations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    phone: text('phone'),
    description: text('description').notNull().default(''),
    address: json('address').$type<Address>().notNull(),
    website: text('website'),
    priceLevel: smallint('price_level').notNull().default(1),
    accessibilityLevel: smallint('accessibility_level').notNull().default(1),
    hasWifi: boolean('has_wifi').notNull().default(false),
    tags: json('tags').$type<string[]>().notNull().default([]),
    media: json('media').$type<Media[]>().notNull().default([]),
    totalVotes: integer('total_votes').notNull().default(0),
    totalPoints: integer('total_points').notNull().default(0),
    totalFavorites: integer('total_favorites').notNull().default(0),
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
    tags: json('tags').$type<string[]>().notNull().default([]),
    media: json('media').$type<Media[]>().notNull().default([]),
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

export const listsRelations = relations(lists, ({ one, many }) => ({
  user: one(users, {
    fields: [lists.userId],
    references: [users.id],
  }),
  items: many(listItems),
}));

export const listItems = pgTable(
  'list_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    listId: uuid('list_id')
      .notNull()
      .references(() => lists.id, { onDelete: 'cascade' }),
    locationId: uuid('location_id')
      .notNull()
      .references(() => locations.id),
    index: integer('index').notNull(),
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

export const countries = pgTable('countries', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  iso2: text('iso2').notNull(),
  numericCode: text('numeric_code').notNull(),
  phoneCode: text('phone_code').notNull(),
  capital: text('capital').notNull(),
  currency: text('currency').notNull(),
  currencyName: text('currency_name').notNull(),
  currencySymbol: text('currency_symbol').notNull(),
  tld: text('tld').notNull(),
  native: text('native').notNull(),
  region: text('region').notNull(),
  subregion: text('subregion').notNull(),
  timezones: text('timezones').notNull(),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
});

export const states = pgTable('states', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  countryId: integer('country_id').notNull(),
  countryCode: text('country_code').notNull(),
  countryName: text('country_name').notNull(),
  stateCode: text('state_code').notNull(),
  type: text('type'),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
});

export const cities = pgTable('cities', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  stateId: integer('state_id').notNull(),
  stateCode: text('state_code').notNull(),
  stateName: text('state_name').notNull(),
  countryId: integer('country_id').notNull(),
  countryCode: text('country_code').notNull(),
  countryName: text('country_name').notNull(),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
  wikiDataId: text('wiki_data_id').notNull(),
});

export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    locationId: uuid('location_id')
      .notNull()
      .references(() => locations.id),
    rating: smallint('rating').notNull(),
    comment: text('comment').notNull(),
    likeCount: integer('like_count').notNull().default(0),
    media: json('media').$type<Media[]>().notNull().default([]),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      reviewsUserIdx: index('reviews_user_idx').on(table.userId),
      reviewsLocationIdx: index('reviews_location_idx').on(table.locationId),
    };
  }
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  location: one(locations, {
    fields: [reviews.locationId],
    references: [locations.id],
  }),
}));

export const reviewLikes = pgTable(
  'review_likes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    reviewId: uuid('review_id')
      .notNull()
      .references(() => reviews.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      reviewLikesUserIdx: index('review_likes_user_idx').on(table.userId),
      uniqueReviewLikes: unique().on(table.userId, table.reviewId),
    };
  }
);

export const favorites = pgTable(
  'favorites',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    locationId: uuid('location_id')
      .notNull()
      .references(() => locations.id),
    profileIndex: smallint('profile_index').notNull().default(-1),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      favoritesUserIdIdx: index('favorites_user_id_idx').on(table.userId),
      uniqueFavorites: unique().on(table.userId, table.locationId),
    };
  }
);

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  location: one(locations, {
    fields: [favorites.locationId],
    references: [locations.id],
  }),
}));

export const reportStatusEnum = pgEnum('report_status', [
  'pending',
  'in_progress',
  'resolved',
]);

export const reportTargetTypeEnum = pgEnum('report_target_type', [
  'event',
  'location',
  'list',
  'user',
  'review',
]);

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  reporterId: uuid('reporter_id')
    .notNull()
    .references(() => users.id),
  targetId: text('target_id').notNull(),
  targetType: reportTargetTypeEnum('target_type').notNull(),
  reason: text('reason').notNull(),
  comment: text('comment'),
  status: reportStatusEnum('status').notNull().default('pending'),
  resolvedBy: text('resolved_by'),
  resolvedAt: timestamp('resolved_at'),
  resolveComment: text('resolve_comment'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
