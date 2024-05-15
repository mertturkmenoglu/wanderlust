import { User, createClerkClient } from "@clerk/backend";
import { count, eq, inArray } from "drizzle-orm";
import { db } from "./db";
import {
  handleUserCreate,
  handleUserUpdate,
  type THandleUserCreatePayload,
  type THandleUserUpdatePayload,
} from "./db/handle-user-sync";
import { auths } from "./db/schema";
import env from "./env";

function mapUserToHandleUserCreatePayload(
  user: User
): THandleUserCreatePayload {
  return {
    id: user.id,
    created_at: user.createdAt,
    email_addresses: user.emailAddresses.map((e) => ({
      email_address: e.emailAddress,
      id: e.id,
      linked_to: e.linkedTo.map((l) => ({
        id: l.id,
        type: l.type,
        object: "email_address",
      })),
      object: "email_address",
      verification: {
        attempts: e.verification?.attempts ?? 0,
        expire_at: e.verification?.expireAt ?? 0,
        id: "",
        object: "email_address",
        status: e.verification?.status ?? "",
        strategy: e.verification?.strategy ?? "",
      },
    })),
    first_name: user.firstName,
    image_url: user.imageUrl,
    last_name: user.lastName,
    last_sign_in_at: user.lastSignInAt,
    updated_at: user.updatedAt,
    username: user.username,
  };
}

function mapUserToHandleUserUpdatePayload(
  user: User
): THandleUserUpdatePayload {
  return mapUserToHandleUserCreatePayload(user);
}

async function syncClerkDataWithLocalDatabase() {
  console.log(`Starting data sync: ${new Date().toISOString()}`);
  console.time("sync-timer");

  const client = createClerkClient({
    secretKey: env.CLERK_SECRET_KEY,
    publishableKey: env.CLERK_PUBLISHABLE_KEY,
  });

  const clerkUsersCount = await client.users.getCount();
  console.log(`Clerk has ${clerkUsersCount} users`);

  const [{ value }] = await db.select({ value: count() }).from(auths);
  console.log(`Local database has ${value} users`);

  // Pre allocate memory for all the Clerk user ids.
  const clerkUserIds: string[] = new Array(clerkUsersCount);
  let clerkUserIdsIndex = 0;
  let createdCount = 0;
  let updatedCount = 0;
  let deletedCount = 0;

  const STEP = 500; // Clerk max limit

  for (let offset = 0; offset <= clerkUsersCount; offset += STEP) {
    console.log(`Entered loop. Offset: ${offset}`);

    const res = await client.users.getUserList({
      limit: STEP,
      offset,
    });

    for (const clerkUser of res.data) {
      const dbRes = await db
        .select()
        .from(auths)
        .where(eq(auths.clerkId, clerkUser.id))
        .limit(1);

      if (dbRes.length === 1) {
        // User is already in our database, update it.
        console.log(`User ${clerkUser.id} found in database, updating`);
        await handleUserUpdate(mapUserToHandleUserUpdatePayload(clerkUser));
        updatedCount++;
      } else if (dbRes.length === 0) {
        // User is not in our database, create one.
        console.log(`User ${clerkUser.id} is not in database, creating`);
        await handleUserCreate(mapUserToHandleUserCreatePayload(clerkUser));
        createdCount++;
      }

      clerkUserIds[clerkUserIdsIndex] = clerkUser.id;
      clerkUserIdsIndex++;
    }
  }

  // All Clerk user ids is in an array.
  // Traverse all local database users, find which ones are not in Clerk, delete them
  const toDeleteIds: string[] = [];

  const [{ value: totalDbUsers }] = await db
    .select({ value: count() })
    .from(auths);

  for (let offset = 0; offset <= totalDbUsers; offset += 10) {
    const dbRes = await db.select().from(auths).offset(offset).limit(10);

    for (const dbUser of dbRes) {
      const inClerk = clerkUserIds.includes(dbUser.clerkId);

      if (!inClerk) {
        // This user must be deleted
        toDeleteIds.push(dbUser.id);
        deletedCount++;
      }
    }
  }

  if (toDeleteIds.length > 0) {
    // Delete all the users that in local database but not in Clerk
    await db.delete(auths).where(inArray(auths.id, toDeleteIds));
  }

  console.log(`Sync ended: ${new Date().toISOString()}`);
  console.timeEnd("sync-timer");
  console.log(`Summary:`);
  console.table({
    createdCount,
    updatedCount,
    deletedCount,
  });
  process.exit(0);
}

syncClerkDataWithLocalDatabase();
