import { text, pgTable, uuid, bigint } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
});

export type User = typeof users.$inferSelect;

export const auths = pgTable("auths", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  emailId: text("email_id"),
  emailVerification: text("email_verification"),
  lastSignInAt: bigint("last_sign_in_at", { mode: "number" }),
  createdAt: bigint("created_at", { mode: "number" }),
  updatedAt: bigint("updated_at", { mode: "number" }),
  username: text("username"),
  image: text("image"),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull()
    .unique(),
});
