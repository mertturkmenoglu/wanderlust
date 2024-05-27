import { User, createClerkClient } from '@clerk/backend';
import { count, eq, inArray } from 'drizzle-orm';
import { db } from '../src/db';
import {
  handleUserCreate,
  handleUserUpdate,
  type THandleUserCreatePayload,
  type THandleUserUpdatePayload,
} from '../src/db/handle-user-sync';
import { auths } from '../src/db/schema';
import { logger } from '../src/logger';
import env from '../src/start/env';

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
        object: 'email_address',
      })),
      object: 'email_address',
      verification: {
        attempts: e.verification?.attempts ?? 0,
        expire_at: e.verification?.expireAt ?? 0,
        id: '',
        object: 'email_address',
        status: e.verification?.status ?? '',
        strategy: e.verification?.strategy ?? '',
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
  logger.info(`Starting data sync: ${new Date().toISOString()}`);
  console.time('sync-timer');

  const client = createClerkClient({
    secretKey: env.CLERK_SECRET_KEY,
    publishableKey: env.CLERK_PUBLISHABLE_KEY,
  });

  const clerkUsersCount = await client.users.getCount();
  logger.info(`Clerk has ${clerkUsersCount} users`);

  const [{ value }] = await db.select({ value: count() }).from(auths);
  logger.info(`Local database has ${value} users`);

  // Pre allocate memory for all the Clerk user ids.
  const clerkUserIds: string[] = new Array(clerkUsersCount);
  let clerkUserIdsIndex = 0;
  let createdCount = 0;
  let updatedCount = 0;
  let deletedCount = 0;

  const STEP = 500; // Clerk max limit

  logger.info(`Starting fetching all Clerk users with ${STEP} steps`);

  for (let offset = 0; offset <= clerkUsersCount; offset += STEP) {
    logger.info(`Fetching users. Offset: ${offset}`);

    const res = await client.users.getUserList({
      limit: STEP,
      offset,
    });

    logger.info('Checking if users are in database for this batch');

    for (const clerkUser of res.data) {
      const dbRes = await db
        .select()
        .from(auths)
        .where(eq(auths.clerkId, clerkUser.id))
        .limit(1);

      if (dbRes.length === 1) {
        // User is already in our database, update it.
        logger.info(`User ${clerkUser.id} found in database, updating`);
        await handleUserUpdate(mapUserToHandleUserUpdatePayload(clerkUser));
        updatedCount++;
      } else if (dbRes.length === 0) {
        // User is not in our database, create one.
        logger.info(`User ${clerkUser.id} is not in database, creating`);
        await handleUserCreate(mapUserToHandleUserCreatePayload(clerkUser));
        createdCount++;
      }

      clerkUserIds[clerkUserIdsIndex] = clerkUser.id;
      clerkUserIdsIndex++;
    }
  }

  logger.info('Fetched all Clerk users');

  // All Clerk user ids is in an array.
  // Traverse all local database users, find which ones are not in Clerk, delete them
  const toDeleteIds: string[] = [];

  const [{ value: totalDbUsers }] = await db
    .select({ value: count() })
    .from(auths);

  logger.info(`Starting to read users from database in batches of 10`);

  for (let offset = 0; offset <= totalDbUsers; offset += 10) {
    logger.info(`Reading users from database. Offset: ${offset}`);
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

  logger.info('Read all users from database.');
  logger.info(`Found ${toDeleteIds.length} many users that should be deleted.`);

  if (toDeleteIds.length > 0) {
    logger.info('Deleting users');
    // Delete all the users that in local database but not in Clerk
    await db.delete(auths).where(inArray(auths.id, toDeleteIds));
    logger.info('Users deleted');
  }

  logger.info(`Sync ended: ${new Date().toISOString()}`);
  console.timeEnd('sync-timer');
  logger.info(`Summary:`);

  console.table([
    ['Operation', 'Count'],
    ['User created', `${createdCount}`],
    ['User updated', `${updatedCount}`],
    ['User deleted', `${deletedCount}`],
  ]);

  process.exit(0);
}

syncClerkDataWithLocalDatabase();
