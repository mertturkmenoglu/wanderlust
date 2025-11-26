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
    hours: jsonb().notNull().default("{}"),
    amenities: jsonb().notNull().default("[]"),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [index().on(table.addressId), index().on(table.categoryId)]
);

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

export const collections = pgTable("collections", {
  id: text().primaryKey(),
  name: text().notNull(),
  description: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

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
