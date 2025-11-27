import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  pgView,
  primaryKey,
  smallint,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  banner: text("banner"),
  bio: text("bio"),
  website: text("website"),
  followersCount: integer("followers_count").notNull().default(0),
  followingCount: integer("following_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const usersRelations = relations(users, ({ many }) => ({
  bookmarks: many(bookmarks),
  favorites: many(favorites),
  lists: many(lists),
  reviews: many(reviews),
  trips: many(trips),
  topPlaces: many(userTopPlaces),
}));

export const admins = pgTable("admins", {
  userId: text()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const assetEntityType = pgEnum("asset_entity_type", ["place", "review"]);

export const assets = pgTable(
  "assets",
  {
    id: bigint({ mode: "number" }).generatedAlwaysAsIdentity().primaryKey(),
    entityType: assetEntityType().notNull(),
    entityId: text().notNull(),
    url: text().notNull(),
    description: text(),
    order: integer().notNull().default(0),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [index().on(table.entityType, table.entityId)]
);

export const assetsRelations = relations(assets, ({ one }) => ({
  reviews: one(reviews, {
    fields: [assets.entityId],
    references: [reviews.id],
  }),
  places: one(places, {
    fields: [assets.entityId],
    references: [places.id],
  }),
}));

export const follows = pgTable(
  "follows",
  {
    followerId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.followerId, table.followingId] })]
);

export const profile = pgView("profile").as((qb) => {
  return qb
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      bio: users.bio,
      website: users.website,
      image: users.image,
      banner: users.banner,
      followersCount: users.followersCount,
      followingCount: users.followingCount,
      createdAt: users.createdAt,
    })
    .from(users);
});

export const categories = pgTable("categories", {
  id: smallint().primaryKey(),
  name: text().notNull().unique(),
  image: text().notNull(),
});

export const cities = pgTable("cities", {
  id: integer().primaryKey(),
  name: text().notNull(),
  stateCode: text().notNull(),
  stateName: text().notNull(),
  countryCode: text().notNull(),
  countryName: text().notNull(),
  image: text().notNull(),
  lat: doublePrecision().notNull(),
  lng: doublePrecision().notNull(),
  description: text().notNull(),
});

export const addresses = pgTable("addresses", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  cityId: integer()
    .notNull()
    .references(() => cities.id, { onDelete: "cascade" }),
  line1: text().notNull(),
  line2: text(),
  postalCode: text(),
  lat: doublePrecision().notNull(),
  lng: doublePrecision().notNull(),
});

export const addressesRelations = relations(addresses, ({ one }) => ({
  city: one(cities, {
    fields: [addresses.cityId],
    references: [cities.id],
  }),
}));

export const places = pgTable(
  "places",
  {
    id: text().primaryKey(),
    name: text().notNull(),
    description: text().notNull(),
    phone: text(),
    website: text(),
    addressId: integer()
      .notNull()
      .references(() => addresses.id, { onDelete: "cascade" }),
    categoryId: smallint()
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    priceLevel: smallint().notNull(),
    accessibilityLevel: smallint().notNull(),
    totalVotes: integer().notNull().default(0),
    totalPoints: integer().notNull().default(0),
    totalFavorites: integer().notNull().default(0),
    hours: jsonb().notNull().default("{}").$type<Record<string, string>>(),
    amenities: jsonb().notNull().default("[]").$type<string[]>(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [index().on(table.addressId), index().on(table.categoryId)]
);

export const placesRelations = relations(places, ({ one, many }) => ({
  address: one(addresses, {
    fields: [places.addressId],
    references: [addresses.id],
  }),
  category: one(categories, {
    fields: [places.categoryId],
    references: [categories.id],
  }),
  assets: many(assets),
}));

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: bigint({ mode: "number" }).generatedAlwaysAsIdentity().primaryKey(),
    placeId: text()
      .notNull()
      .references(() => places.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique().on(table.userId, table.placeId)]
);

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  place: one(places, {
    fields: [bookmarks.placeId],
    references: [places.id],
  }),
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
}));

export const favorites = pgTable(
  "favorites",
  {
    id: bigint({ mode: "number" }).generatedAlwaysAsIdentity().primaryKey(),
    placeId: text()
      .notNull()
      .references(() => places.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique().on(table.userId, table.placeId)]
);

export const favoritesRelations = relations(favorites, ({ one }) => ({
  place: one(places, {
    fields: [favorites.placeId],
    references: [places.id],
  }),
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
}));

export const collections = pgTable("collections", {
  id: text().primaryKey(),
  name: text().notNull(),
  description: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
  items: many(collectionItems),
}));

export const collectionItems = pgTable(
  "collection_items",
  {
    collectionId: text()
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    placeId: text()
      .notNull()
      .references(() => places.id, { onDelete: "cascade" }),
    index: integer().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.collectionId, table.placeId] }),
    unique().on(table.collectionId, table.index),
  ]
);

export const collectionItemsRelations = relations(
  collectionItems,
  ({ one }) => ({
    collection: one(collections, {
      fields: [collectionItems.collectionId],
      references: [collections.id],
    }),
    place: one(places, {
      fields: [collectionItems.placeId],
      references: [places.id],
    }),
  })
);

export const collectionsPlaces = pgTable(
  "collections_places",
  {
    collectionId: text()
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    placeId: text()
      .notNull()
      .references(() => places.id, { onDelete: "cascade" }),
    index: integer().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.collectionId, table.placeId] }),
    unique().on(table.collectionId, table.index),
  ]
);

export const collectionsPlacesRelations = relations(
  collectionsPlaces,
  ({ one }) => ({
    collection: one(collections, {
      fields: [collectionsPlaces.collectionId],
      references: [collections.id],
    }),
    place: one(places, {
      fields: [collectionsPlaces.placeId],
      references: [places.id],
    }),
  })
);

export const collectionsCities = pgTable(
  "collections_cities",
  {
    collectionId: text()
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    cityId: integer()
      .notNull()
      .references(() => cities.id, { onDelete: "cascade" }),
    index: integer().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.collectionId, table.cityId] }),
    unique().on(table.collectionId, table.index),
  ]
);

export const collectionsCitiesRelations = relations(
  collectionsCities,
  ({ one }) => ({
    collection: one(collections, {
      fields: [collectionsCities.collectionId],
      references: [collections.id],
    }),
    city: one(cities, {
      fields: [collectionsCities.cityId],
      references: [cities.id],
    }),
  })
);

export const lists = pgTable(
  "lists",
  {
    id: text().primaryKey(),
    name: text().notNull(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    isPublic: boolean().notNull().default(false),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [index().on(table.userId)]
);

export const listsRelations = relations(lists, ({ many, one }) => ({
  items: many(listItems),
  user: one(users, {
    fields: [lists.userId],
    references: [users.id],
  }),
}));

export const listItems = pgTable(
  "list_items",
  {
    listId: text()
      .notNull()
      .references(() => lists.id, { onDelete: "cascade" }),
    placeId: text()
      .notNull()
      .references(() => places.id, { onDelete: "cascade" }),
    index: integer().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.listId, table.placeId] }),
    unique().on(table.listId, table.index),
  ]
);

export const listItemsRelations = relations(listItems, ({ one }) => ({
  list: one(lists, {
    fields: [listItems.listId],
    references: [lists.id],
  }),
  place: one(places, {
    fields: [listItems.placeId],
    references: [places.id],
  }),
}));

export const reviews = pgTable(
  "reviews",
  {
    id: text().primaryKey(),
    placeId: text()
      .notNull()
      .references(() => places.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text().notNull(),
    rating: smallint().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [index().on(table.placeId), index().on(table.userId)]
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  place: one(places, {
    fields: [reviews.placeId],
    references: [places.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const tripVisibilityLevel = pgEnum("trip_visibility_level", [
  "private",
  "friends",
  "public",
]);

export const trips = pgTable("trips", {
  id: text().primaryKey(),
  ownerId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text().notNull(),
  description: text().notNull().default(""),
  visibilityLevel: tripVisibilityLevel().notNull().default("private"),
  requestedAmenities: jsonb().notNull().default("[]"),
  startAt: timestamp({ withTimezone: true }).notNull(),
  endAt: timestamp({ withTimezone: true }).notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const tripsRelations = relations(trips, ({ many, one }) => ({
  participants: many(tripParticipants),
  invites: many(tripInvites),
  locations: many(tripLocations),
  comments: many(tripComments),
  owner: one(users, {
    fields: [trips.ownerId],
    references: [users.id],
  }),
}));

export const tripRole = pgEnum("trip_role", ["member", "editor"]);

export const tripInvites = pgTable(
  "trip_invites",
  {
    id: text().primaryKey(),
    tripId: text()
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    fromId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    toId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sentAt: timestamp({ withTimezone: true }).notNull(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    tripTitle: text().notNull(),
    role: tripRole().notNull(),
  },
  (table) => [
    unique().on(table.tripId, table.toId),
    index().on(table.toId),
    index().on(table.fromId),
    index().on(table.tripId),
  ]
);

export const tripInvitesRelations = relations(tripInvites, ({ one }) => ({
  trip: one(trips, {
    fields: [tripInvites.tripId],
    references: [trips.id],
  }),
  fromUser: one(users, {
    fields: [tripInvites.fromId],
    references: [users.id],
  }),
  toUser: one(users, {
    fields: [tripInvites.toId],
    references: [users.id],
  }),
}));

export const tripComments = pgTable(
  "trip_comments",
  {
    id: text().primaryKey(),
    tripId: text()
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [index().on(table.tripId), index().on(table.userId)]
);

export const tripCommentsRelations = relations(tripComments, ({ one }) => ({
  trip: one(trips, {
    fields: [tripComments.tripId],
    references: [trips.id],
  }),
  user: one(users, {
    fields: [tripComments.userId],
    references: [users.id],
  }),
}));

export const tripLocations = pgTable(
  "trip_locations",
  {
    id: text().primaryKey(),
    tripId: text()
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    scheduledTime: timestamp({ withTimezone: true }).notNull(),
    placeId: text()
      .notNull()
      .references(() => places.id, { onDelete: "cascade" }),
    description: text().notNull(),
  },
  (table) => [
    unique().on(table.tripId, table.placeId, table.scheduledTime),
    index().on(table.tripId),
    index().on(table.placeId),
  ]
);

export const tripLocationsRelations = relations(tripLocations, ({ one }) => ({
  trip: one(trips, {
    fields: [tripLocations.tripId],
    references: [trips.id],
  }),
  place: one(places, {
    fields: [tripLocations.placeId],
    references: [places.id],
  }),
}));

export const tripParticipants = pgTable(
  "trip_participants",
  {
    id: text().primaryKey(),
    tripId: text()
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: tripRole().notNull(),
  },
  (table) => [unique().on(table.tripId, table.userId)]
);

export const tripParticipantsRelations = relations(
  tripParticipants,
  ({ one }) => ({
    trip: one(trips, {
      fields: [tripParticipants.tripId],
      references: [trips.id],
    }),
    user: one(users, {
      fields: [tripParticipants.userId],
      references: [users.id],
    }),
  })
);

export const reports = pgTable(
  "reports",
  {
    id: text().primaryKey(),
    resourceId: text().notNull(),
    resourceType: text().notNull(),
    reporterId: text()
      .notNull()
      .references(() => users.id),
    reason: integer().notNull(),
    resolved: boolean().notNull().default(false),
    resolvedAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index().on(table.reporterId),
    index().on(table.resolved),
    index().on(table.resolvedAt),
    index().on(table.createdAt),
    index().on(table.updatedAt),
  ]
);

export const userTopPlaces = pgTable(
  "user_top_places",
  {
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    placeId: text()
      .notNull()
      .references(() => places.id, { onDelete: "cascade" }),
    index: integer().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.placeId] }),
    unique().on(table.userId, table.placeId, table.index),
  ]
);

export const userTopPlacesRelations = relations(userTopPlaces, ({ one }) => ({
  user: one(users, {
    fields: [userTopPlaces.userId],
    references: [users.id],
  }),
  place: one(places, {
    fields: [userTopPlaces.placeId],
    references: [places.id],
  }),
}));

export const $ = {
  user: createSelectSchema(users, {
    id: z
      .string()
      .min(1)
      .meta({
        description: "User ID",
        examples: ["abcdef1234"],
      }),
    name: z
      .string()
      .min(1)
      .max(256)
      .meta({
        description: "Full name of the user",
        examples: ["John Doe"],
      }),
    username: z
      .string()
      .min(1)
      .max(32)
      .meta({
        description: "Unique username of the user",
        examples: ["johndoe"],
      }),
    email: z.email().meta({
      description: "Email address of the user",
      examples: ["johndoe@example.com"],
    }),
    emailVerified: z.boolean().meta({
      description: "Whether the user's email is verified",
      examples: [true],
    }),
    image: z
      .url()
      .nullable()
      .meta({
        description: "Profile image URL of the user",
        examples: ["https://example.com/images/johndoe.jpg"],
      }),
    banner: z
      .url()
      .nullable()
      .meta({
        description: "Banner image URL of the user",
        examples: ["https://example.com/images/johndoe-banner.jpg"],
      }),
    bio: z
      .string()
      .max(512)
      .nullable()
      .meta({
        description: "Short biography of the user",
        examples: [
          "Travel enthusiast and photographer. Love exploring new places!",
        ],
      }),
    website: z
      .url()
      .nullable()
      .meta({
        description: "Personal website URL of the user",
        examples: ["https://johndoe.com"],
      }),
    followersCount: z
      .number()
      .int()
      .min(0)
      .meta({
        description: "Number of followers the user has",
        examples: [150],
      }),
    followingCount: z
      .number()
      .int()
      .min(0)
      .meta({
        description: "Number of users the user is following",
        examples: [75],
      }),
    createdAt: z.date().meta({
      description: "Timestamp when the user was created",
      examples: [new Date("2023-01-15T10:00:00Z")],
    }),
    updatedAt: z.date().meta({
      description: "Timestamp when the user was last updated",
      examples: [new Date("2023-01-15T10:00:00Z")],
    }),
  }).meta({
    description: "A user entity",
  }),
  asset: createSelectSchema(assets, {
    id: z.bigint().meta({
      description: "Asset ID",
      examples: [12345678901234],
    }),
    entityType: z.enum(["place", "review"]).meta({
      description: "Type of entity the asset is associated with",
      examples: ["place"],
    }),
    entityId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the associated entity",
        examples: ["place123"],
      }),
    url: z.url().meta({
      description: "URL of the asset",
      examples: ["https://example.com/assets/image.jpg"],
    }),
    description: z
      .string()
      .max(512)
      .nullable()
      .meta({
        description: "Description of the asset",
        examples: ["A beautiful view of the city skyline."],
      }),
    order: z
      .number()
      .int()
      .min(0)
      .max(64)
      .meta({
        description:
          "Order of the asset among other assets for the same entity",
        examples: [0],
      }),
    createdAt: z.date().meta({
      description: "Timestamp when the asset was created",
      examples: [new Date("2023-01-15T10:00:00Z")],
    }),
    updatedAt: z.date().meta({
      description: "Timestamp when the asset was last updated",
      examples: [new Date("2023-01-15T10:00:00Z")],
    }),
  }).meta({
    description: "An asset entity",
  }),
  follows: createSelectSchema(follows, {
    followerId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the follower user",
        examples: ["user123"],
      }),
    followingId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the following user",
        examples: ["user456"],
      }),
    createdAt: z.date().meta({
      description: "Timestamp when the follow relationship was created",
      examples: [new Date("2023-01-15T10:00:00Z")],
    }),
  }),
  category: createSelectSchema(categories, {
    id: z
      .number()
      .int()
      .min(1)
      .max(32767)
      .meta({
        description: "Category ID",
        examples: [12],
      }),
    name: z
      .string()
      .min(1)
      .max(64)
      .meta({
        description: "Name of the category",
        examples: ["Museums"],
      }),
    image: z
      .string()
      .min(1)
      .meta({
        description: "Image URL of the category",
        examples: ["https://example.com/images/museums.jpg"],
      }),
  }).meta({
    description: "A category entity",
  }),
  city: createSelectSchema(cities, {
    id: z
      .number()
      .int()
      .min(1)
      .max(2147483647)
      .meta({
        description: "City ID",
        examples: [1024],
      }),
    name: z
      .string()
      .min(1)
      .max(128)
      .meta({
        description: "Name of the city",
        examples: ["London"],
      }),
    stateCode: z
      .string()
      .min(1)
      .max(16)
      .meta({
        description: "State code",
        examples: ["ENG"],
      }),
    stateName: z
      .string()
      .min(1)
      .max(64)
      .meta({
        description: "State name",
        examples: ["England"],
      }),
    countryCode: z
      .string()
      .length(2)
      .meta({
        description: "Country code",
        examples: ["GB"],
      }),
    countryName: z
      .string()
      .min(1)
      .max(64)
      .meta({
        description: "Country name",
        examples: ["United Kingdom"],
      }),
    image: z
      .string()
      .min(1)
      .meta({
        description: "Image URL of the city",
        examples: ["https://example.com/images/london.jpg"],
      }),
    lat: z
      .number()
      .min(-90)
      .max(90)
      .meta({
        description: "Latitude",
        examples: [51.5074],
      }),
    lng: z
      .number()
      .min(-180)
      .max(180)
      .meta({
        description: "Longitude",
        examples: [-0.1278],
      }),
    description: z
      .string()
      .min(1)
      .meta({
        description: "Description of the city",
        examples: [
          "London is the capital city of the United Kingdom, known for its rich history and vibrant culture.",
        ],
      }),
  }).meta({
    description: "A city entity",
  }),
  address: createSelectSchema(addresses, {
    id: z
      .number()
      .int()
      .min(0)
      .max(2147483647)
      .meta({
        description: "Address ID",
        examples: [2048],
      }),
    cityId: z
      .number()
      .int()
      .min(0)
      .max(2147483647)
      .meta({
        description: "ID of the city associated with the address",
        examples: [1024],
      }),
    line1: z
      .string()
      .min(1)
      .max(256)
      .meta({
        description: "First line of the address",
        examples: ["221B Baker Street"],
      }),
    line2: z
      .string()
      .max(256)
      .nullable()
      .meta({
        description: "Second line of the address",
        examples: ["Apartment 2"],
      }),
    postalCode: z
      .string()
      .max(20)
      .nullable()
      .meta({
        description: "Postal code of the address",
        examples: ["NW1 6XE"],
      }),
    lat: z
      .number()
      .min(-90)
      .max(90)
      .meta({
        description: "Latitude of the address",
        examples: [51.5074],
      }),
    lng: z
      .number()
      .min(-180)
      .max(180)
      .meta({
        description: "Longitude of the address",
        examples: [-0.1278],
      }),
  }),
  place: createSelectSchema(places, {
    id: z
      .string()
      .min(1)
      .meta({
        description: "Place ID",
        examples: ["place123"],
      }),
    name: z
      .string()
      .min(1)
      .max(256)
      .meta({
        description: "Name of the place",
        examples: ["The British Museum"],
      }),
    description: z
      .string()
      .min(1)
      .meta({
        description: "Description of the place",
        examples: [
          "A world-famous museum showcasing art and artifacts from around the globe.",
        ],
      }),
    phone: z
      .string()
      .max(32)
      .nullable()
      .meta({
        description: "Contact phone number of the place",
        examples: ["+90 500 123 4567"],
      }),
    website: z
      .url()
      .nullable()
      .meta({
        description: "Website URL of the place",
        examples: ["https://www.example.com"],
      }),
    addressId: z
      .number()
      .int()
      .min(0)
      .max(2147483647)
      .meta({
        description: "ID of the address associated with the place",
        examples: [2048],
      }),
    categoryId: z
      .number()
      .int()
      .min(1)
      .max(32767)
      .meta({
        description: "ID of the category associated with the place",
        examples: [12],
      }),
    priceLevel: z
      .number()
      .int()
      .min(1)
      .max(5)
      .meta({
        description: "Price level of the place (1-5)",
        examples: [1, 2, 3, 4, 5],
      }),
    accessibilityLevel: z
      .number()
      .int()
      .min(1)
      .max(5)
      .meta({
        description: "Accessibility level of the place (1-5)",
        examples: [1, 2, 3, 4, 5],
      }),
    totalVotes: z
      .number()
      .int()
      .min(0)
      .meta({
        description: "Total number of votes the place has received",
        examples: [250],
      }),
    totalPoints: z
      .number()
      .int()
      .min(0)
      .meta({
        description: "Total points accumulated from votes",
        examples: [1125],
      }),
    totalFavorites: z
      .number()
      .int()
      .min(0)
      .meta({
        description: "Total number of times the place has been favorited",
        examples: [75],
      }),
    hours: z.record(z.string(), z.string()).meta({
      description: "Operating hours of the place",
      examples: [
        {
          mon: "9:00 AM - 5:00 PM",
          tue: "9:00 AM - 5:00 PM",
          wed: "9:00 AM - 5:00 PM",
          thu: "9:00 AM - 5:00 PM",
          fri: "9:00 AM - 5:00 PM",
          sat: "10:00 AM - 6:00 PM",
          sun: "Closed",
        },
      ],
    }),
    amenities: z.array(z.string()).meta({
      description: "List of amenities available at the place",
      examples: [["WiFi", "Parking", "Restrooms"]],
    }),
    createdAt: z.date().meta({
      description: "Timestamp when the place was created",
      examples: [new Date("2023-01-15T10:00:00Z")],
    }),
    updatedAt: z.date().meta({
      description: "Timestamp when the place was last updated",
      examples: [new Date("2023-01-15T10:00:00Z")],
    }),
  }).meta({
    description: "A place entity",
  }),
  bookmark: createSelectSchema(bookmarks, {
    id: z.bigint().meta({
      description: "Bookmark ID",
      examples: [12345678901234],
    }),
    placeId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the bookmarked place",
        examples: ["place123"],
      }),
    userId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the user who created the bookmark",
        examples: ["user123"],
      }),
    createdAt: z.date().meta({
      description: "Timestamp when the bookmark was created",
      examples: [new Date("2023-01-15T10:00:00Z")],
    }),
  }).meta({
    description: "A bookmark entity",
  }),
  favorite: createSelectSchema(favorites, {
    id: z.bigint().meta({
      description: "Favorite ID",
      examples: [12345678901234],
    }),
    placeId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the favorited place",
        examples: ["place123"],
      }),
    userId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the user who favorited the place",
        examples: ["user123"],
      }),
    createdAt: z.date().meta({
      description: "Timestamp when the favorite was created",
      examples: [new Date("2023-01-15T10:00:00Z")],
    }),
  }).meta({
    description: "A favorite entity",
  }),
  collection: createSelectSchema(collections, {
    id: z
      .string()
      .min(1)
      .meta({
        description: "Collection ID",
        examples: ["collection123"],
      }),
    name: z
      .string()
      .min(1)
      .max(256)
      .meta({
        description: "Name of the collection",
        examples: ["My Favorite Places"],
      }),
    description: z
      .string()
      .min(1)
      .meta({
        description: "Description of the collection",
        examples: ["A curated list of my favorite places to visit."],
      }),
    createdAt: z.date().meta({
      description: "Timestamp when the collection was created",
      examples: [new Date("2023-01-15T10:00:00Z")],
    }),
  }).meta({
    description: "A collection entity",
  }),
  collectionItem: createSelectSchema(collectionItems, {
    collectionId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the collection",
        examples: ["collection123"],
      }),
    placeId: z
      .string()
      .min(1)
      .meta({
        description: "Place ID",
        examples: ["place123"],
      }),
    index: z
      .number()
      .int()
      .min(0)
      .meta({
        description: "Index of the item within the collection",
        examples: [0],
      }),
    createdAt: z.date().meta({
      description: "Timestamp when the collection item was created",
      examples: [new Date("2023-01-15T10:00:00Z")],
    }),
  }).meta({
    description: "A collection item entity",
  }),
  list: createSelectSchema(lists, {
    id: z
      .string()
      .min(1)
      .meta({
        description: "List ID",
        examples: ["list123"],
      }),
    name: z
      .string()
      .min(1)
      .max(256)
      .meta({
        description: "Name of the list",
        examples: ["London Attractions"],
      }),
    userId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the user who created the list",
        examples: ["user123"],
      }),
    isPublic: z.boolean().meta({
      description: "Whether the list is public",
      examples: [true],
    }),
    createdAt: z.date().meta({
      description: "Timestamp when the list was created",
      examples: [new Date("2023-01-15T10:00:00Z")],
    }),
    updatedAt: z.date().meta({
      description: "Timestamp when the list was last updated",
      examples: [new Date("2023-01-15T10:00:00Z")],
    }),
  }).meta({
    description: "A list entity",
  }),
  listItem: createSelectSchema(listItems, {
    listId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the list",
        examples: ["list123"],
      }),

    placeId: z
      .string()
      .min(1)
      .meta({
        description: "Place ID",
        examples: ["place123"],
      }),
    index: z
      .number()
      .int()
      .min(0)
      .meta({
        description: "Index of the item within the list",
        examples: [0],
      }),
    createdAt: z.date().meta({
      description: "Timestamp when the list item was created",
      examples: [new Date("2023-01-15T10:00:00Z")],
    }),
  }).meta({
    description: "A list item entity",
  }),
  review: createSelectSchema(reviews, {
    id: z
      .string()
      .min(1)
      .meta({
        description: "Review ID",
        examples: ["review123"],
      }),
    placeId: z
      .string()
      .min(1)
      .meta({
        description: "Place ID",
        examples: ["place123"],
      }),
    userId: z
      .string()
      .min(1)
      .meta({
        description: "User ID",
        examples: ["user123"],
      }),
    content: z
      .string()
      .min(1)
      .meta({
        description: "Content of the review",
        examples: [
          "Amazing place! Had a wonderful time exploring the exhibits.",
        ],
      }),
    rating: z
      .number()
      .min(1)
      .max(5)
      .meta({
        description: "Rating given by the user",
        examples: [5],
      }),
    createdAt: z.date().meta({
      description: "Timestamp when the review was created",
      examples: [new Date("2023-01-15T10:00:00Z")],
    }),
    updatedAt: z.date().meta({
      description: "Timestamp when the review was last updated",
      examples: [new Date("2023-01-15T10:00:00Z")],
    }),
  }).meta({
    description: "A review entity",
  }),
  trip: createSelectSchema(trips, {
    id: z
      .string()
      .min(1)
      .meta({
        description: "Trip ID",
        examples: ["trip123"],
      }),
    ownerId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the user who owns the trip",
        examples: ["user123"],
      }),
    title: z
      .string()
      .min(1)
      .meta({
        description: "Title of the trip",
        examples: ["Summer Vacation in Europe"],
      }),
    description: z
      .string()
      .min(1)
      .meta({
        description: "Description of the trip",
        examples: [
          "Exploring the beautiful cities and landscapes of Europe during summer.",
        ],
      }),
    visibilityLevel: z.enum(["private", "friends", "public"]).meta({
      description: "Visibility level of the trip",
      examples: ["private"],
    }),
    requestedAmenities: z.array(z.string()).meta({
      description: "List of requested amenities for the trip",
      examples: [["WiFi", "Parking"]],
    }),
    startAt: z.date().meta({
      description: "Start timestamp of the trip",
      examples: [new Date("2023-06-01T10:00:00Z")],
    }),
    endAt: z.date().meta({
      description: "End timestamp of the trip",
      examples: [new Date("2023-06-15T18:00:00Z")],
    }),
    createdAt: z.date().meta({
      description: "Timestamp when the trip was created",
      examples: [new Date("2023-01-15T10:00:00Z")],
    }),
    updatedAt: z.date().meta({
      description: "Timestamp when the trip was last updated",
      examples: [new Date("2023-01-15T10:00:00Z")],
    }),
  }).meta({
    description: "A trip entity",
  }),
  tripInvite: createSelectSchema(tripInvites, {
    id: z
      .string()
      .min(1)
      .meta({
        description: "Trip Invite ID",
        examples: ["invite123"],
      }),
    tripId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the trip",
        examples: ["trip123"],
      }),
    fromId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the user who sent the invite",
        examples: ["user123"],
      }),
    toId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the user who received the invite",
        examples: ["user456"],
      }),
    sentAt: z.date().meta({
      description: "Timestamp when the invite was sent",
      examples: [new Date("2023-05-01T12:00:00Z")],
    }),
    expiresAt: z.date().meta({
      description: "Timestamp when the invite expires",
      examples: [new Date("2023-05-15T12:00:00Z")],
    }),
    tripTitle: z
      .string()
      .min(1)
      .meta({
        description: "Title of the trip",
        examples: ["Summer Vacation in Europe"],
      }),
    role: z.enum(["member", "editor"]).meta({
      description: "Role of the user in the trip",
      examples: ["member"],
    }),
  }).meta({
    description: "A trip invite entity",
  }),
  tripComment: createSelectSchema(tripComments, {
    id: z
      .string()
      .min(1)
      .meta({
        description: "Trip Comment ID",
        examples: ["comment123"],
      }),
    tripId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the trip",
        examples: ["trip123"],
      }),
    userId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the user who made the comment",
        examples: ["user123"],
      }),
    content: z
      .string()
      .min(1)
      .meta({
        description: "Content of the comment",
        examples: ["Looking forward to this trip!"],
      }),
    createdAt: z.date().meta({
      description: "Timestamp when the comment was created",
      examples: [new Date("2023-05-02T14:30:00Z")],
    }),
    updatedAt: z.date().meta({
      description: "Timestamp when the comment was last updated",
      examples: [new Date("2023-05-02T14:30:00Z")],
    }),
  }).meta({
    description: "A trip comment entity",
  }),
  tripLocation: createSelectSchema(tripLocations, {
    id: z
      .string()
      .min(1)
      .meta({
        description: "Trip Location ID",
        examples: ["location123"],
      }),
    tripId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the trip",
        examples: ["trip123"],
      }),
    scheduledTime: z.date().meta({
      description: "Scheduled time for the location visit",
      examples: [new Date("2023-06-05T10:00:00Z")],
    }),
    placeId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the place",
        examples: ["place123"],
      }),
    description: z
      .string()
      .min(1)
      .meta({
        description: "Description of the location",
        examples: ["Eiffel Tower"],
      }),
  }).meta({
    description: "A trip location entity",
  }),
  tripParticipant: createSelectSchema(tripParticipants, {
    id: z
      .string()
      .min(1)
      .meta({
        description: "Trip Participant ID",
        examples: ["participant123"],
      }),
    tripId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the trip",
        examples: ["trip123"],
      }),
    userId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the user",
        examples: ["user123"],
      }),
    role: z.enum(["member", "editor"]).meta({
      description: "Role of the participant in the trip",
      examples: ["member"],
    }),
  }).meta({
    description: "A trip participant entity",
  }),
  userTopPlaces: createSelectSchema(userTopPlaces, {
    userId: z
      .string()
      .min(1)
      .meta({
        description: "User ID",
        examples: ["user123"],
      }),
    placeId: z
      .string()
      .min(1)
      .meta({
        description: "Place ID",
        examples: ["place123"],
      }),
    index: z
      .number()
      .min(0)
      .meta({
        description: "Index of the place in the user's top places",
        examples: [0],
      }),
  }).meta({
    description: "A user top places entity",
  }),
  report: createSelectSchema(reports, {
    id: z
      .string()
      .min(1)
      .meta({
        description: "Report ID",
        examples: ["report123"],
      }),
    resourceId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the reported resource",
        examples: ["place123"],
      }),
    resourceType: z
      .string()
      .min(1)
      .meta({
        description: "Type of the reported resource",
        examples: ["place", "review", "comment", "user"],
      }),
    reporterId: z
      .string()
      .min(1)
      .meta({
        description: "ID of the user who reported the resource",
        examples: ["user123"],
      }),
    reason: z
      .string()
      .min(1)
      .meta({
        description: "Reason for reporting the resource",
        examples: ["Inappropriate content"],
      }),
    resolved: z.boolean().meta({
      description: "Whether the report has been resolved",
      examples: [false],
    }),
    resolvedAt: z
      .date()
      .nullable()
      .meta({
        description: "Timestamp when the report was resolved",
        examples: [null],
      }),
    createdAt: z.date().meta({
      description: "Timestamp when the report was created",
      examples: [new Date("2023-05-10T09:00:00Z")],
    }),
    updatedAt: z.date().meta({
      description: "Timestamp when the report was last updated",
      examples: [new Date("2023-05-10T09:00:00Z")],
    }),
  }).meta({
    description: "A report entity",
  }),
};
