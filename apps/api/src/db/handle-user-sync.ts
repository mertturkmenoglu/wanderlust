import { DeletedObjectJSON, UserJSON } from "@clerk/backend";
import { eq } from "drizzle-orm";

import { db } from ".";
import { auths, users } from "./schema";

export type THandleUserCreatePayload = Pick<
  UserJSON,
  | "first_name"
  | "last_name"
  | "username"
  | "image_url"
  | "id"
  | "email_addresses"
  | "last_sign_in_at"
  | "created_at"
  | "updated_at"
>;

export type THandleUserUpdatePayload = THandleUserCreatePayload;

export type THandleUserDeletePayload = Pick<DeletedObjectJSON, "id">;

export async function handleUserCreate(
  data: THandleUserCreatePayload
): Promise<void> {
  const username = data.username;
  if (username === null) {
    throw new Error("Username cannot be null");
  }

  try {
    await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          firstName: data.first_name,
          lastName: data.last_name,
          username: username,
          image: data.image_url,
        })
        .returning();
      await tx.insert(auths).values({
        clerkId: data.id,
        email: data.email_addresses[0]?.email_address,
        emailId: data.email_addresses[0]?.id,
        emailVerification: data.email_addresses[0]?.verification?.status,
        lastSignInAt: data.last_sign_in_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        userId: user.id,
      });
    });
  } catch (e) {
    console.error(e);
  }
}

export async function handleUserUpdate(
  data: THandleUserUpdatePayload
): Promise<void> {
  const username = data.username;
  if (username === null) {
    throw new Error("Username cannot be null");
  }
  try {
    await db.transaction(async (tx) => {
      const [authObj] = await tx
        .update(auths)
        .set({
          clerkId: data.id,
          email: data.email_addresses[0]?.email_address,
          emailId: data.email_addresses[0]?.id,
          emailVerification: data.email_addresses[0]?.verification?.status,
          lastSignInAt: data.last_sign_in_at,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        })
        .where(eq(auths.clerkId, data.id))
        .returning();

      await tx
        .update(users)
        .set({
          firstName: data.first_name,
          lastName: data.last_name,
          username: username,
          image: data.image_url,
        })
        .where(eq(users.id, authObj.userId));
    });
  } catch (e) {
    console.error(e);
  }
}

export async function handleUserDelete(
  data: THandleUserDeletePayload
): Promise<void> {
  try {
    await db.transaction(async (tx) => {
      const clerkId = data.id;
      if (clerkId === undefined) {
        throw new Error("Clerk ID is undefined");
      }
      const [authObj] = await tx
        .delete(auths)
        .where(eq(auths.clerkId, clerkId))
        .returning();
      await tx.delete(users).where(eq(users.id, authObj.userId));
    });
  } catch (e) {
    console.error(e);
  }
}
