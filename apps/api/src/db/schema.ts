import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  char,
  doublePrecision,
  index,
  pgTable,
  smallint,
  smallserial,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  username: text("username").notNull().unique(),
  image: text("image"),
});

export type User = typeof users.$inferSelect;

export const follows = pgTable(
  "follows",
  {
    followerId: uuid("follower_id")
      .notNull()
      .references(() => users.id),
    followingId: uuid("following_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      followsFollowerIdx: index("follows_follower_idx").on(table.followerId),
      followsFollowingIdx: index("follows_following_idx").on(table.followingId),
      uniqueFollows: unique().on(table.followerId, table.followingId),
    };
  }
);

export const auths = pgTable("auths", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email"),
  emailId: text("email_id"),
  emailVerification: text("email_verification"),
  lastSignInAt: bigint("last_sign_in_at", { mode: "number" }),
  createdAt: bigint("created_at", { mode: "number" }),
  updatedAt: bigint("updated_at", { mode: "number" }),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull()
    .unique(),
});

export type AuthUser = typeof auths.$inferSelect;

export const locations = pgTable(
  "locations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    phone: text("phone"),
    addressId: uuid("address_id")
      .references(() => addresses.id)
      .notNull(),
    website: text("website"),
    priceLevel: smallint("price_level").notNull().default(1),
    accessibilityLevel: smallint("accessibility_level").notNull().default(1),
    hasWifi: boolean("has_wifi").notNull().default(false),
    categoryId: smallserial("category_id")
      .notNull()
      .references(() => categories.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      locationsAddressIdx: index("locations_address_idx").on(table.addressId),
      locationsCategoryIdx: index("locations_category_idx").on(
        table.categoryId
      ),
    };
  }
);

export const locationsRelations = relations(locations, ({ one }) => ({
  address: one(addresses, {
    fields: [locations.addressId],
    references: [addresses.id],
  }),
  category: one(categories, {
    fields: [locations.categoryId],
    references: [categories.id],
  }),
}));

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    organizerId: uuid("organizer_id")
      .notNull()
      .references(() => users.id),
    addressId: uuid("address_id")
      .notNull()
      .references(() => addresses.id),
    description: text("description").notNull(),
    startsAt: timestamp("starts_at").notNull(),
    endsAt: timestamp("ends_at").notNull(),
    website: text("website"),
    priceLevel: smallint("price_level").notNull().default(1),
    accessibilityLevel: smallint("accessibility_level").notNull().default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      eventsOrganizerIdx: index("events_organizer_idx").on(table.organizerId),
      eventsAddressIdx: index("events_address_idx").on(table.addressId),
    };
  }
);

export const eventsRelations = relations(events, ({ one }) => ({
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id],
  }),
  address: one(addresses, {
    fields: [events.addressId],
    references: [addresses.id],
  }),
}));

export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    country: char("country", { length: 2 }).notNull(), // Two-letter country code (ISO 3166-1 alpha-2).
    city: text("city").notNull(), // City, district, suburb, town, or village.
    line1: text("line1").notNull(), // Address line 1 (e.g., street, PO Box, or company name).
    line2: text("line2"), // Address line 2 (e.g., apartment, suite, unit, or building).
    postalCode: text("postal_code"), // ZIP or postal code.
    state: text("state"), // State, county, province, or region.
    lat: doublePrecision("lat").notNull(),
    long: doublePrecision("long").notNull(),
  },
  (table) => {
    return {
      addressesCountryIdx: index("addresses_country_idx").on(table.country),
      addressesCityIdx: index("addresses_city_idx").on(table.city),
    };
  }
);

export const categories = pgTable("categories", {
  id: smallserial("id").primaryKey(),
  name: text("name").notNull(),
});
