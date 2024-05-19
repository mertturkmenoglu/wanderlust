import {
  bigint,
  boolean,
  char,
  index,
  pgTable,
  smallint,
  smallserial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    username: text("username"),
    image: text("image"),
  },
  (table) => {
    return {
      usersUsernameIdx: uniqueIndex("users_username_idx").on(table.username),
    };
  }
);

export type User = typeof users.$inferSelect;

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
    addressId: uuid("address_id").references(() => addresses.id),
    website: text("website"),
    priceLevel: smallint("price_level"),
    accessibilityLevel: smallint("accessibility_level"),
    hasWifi: boolean("has_wifi"),
    categoryId: smallserial("category_id"),
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
    priceLevel: smallint("price_level"),
    accessibilityLevel: smallint("accessibility_level"),
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

export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    country: char("country", { length: 2 }).notNull(), // Two-letter country code (ISO 3166-1 alpha-2).
    city: text("city"), // City, district, suburb, town, or village.
    line1: text("line1").notNull(), // Address line 1 (e.g., street, PO Box, or company name).
    line2: text("line2"), // Address line 2 (e.g., apartment, suite, unit, or building).
    postalCode: text("postal_code"), // ZIP or postal code.
    state: text("state"), // State, county, province, or region.
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
