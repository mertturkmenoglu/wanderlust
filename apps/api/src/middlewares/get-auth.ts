import { getAuth as getAuthClerk } from '@hono/clerk-auth';
import { eq } from 'drizzle-orm';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { auths, db, users } from '../db';
import { type Env } from '../start';

/**
 * Enforces authentication.
 *
 * User must be authenticated. Else, returns 401 Unauthorized exception.
 *
 * If user is authenticated, `auth` environment variable is set as the database user.
 *
 * Use it after the `clerkMiddleware` from the `@hono/clerk-auth` package
 *
 * @throws HTTPException 401 if the user is not authenticated.
 */
export const getAuth = createMiddleware<Env>(async (c, next) => {
  const auth = getAuthClerk(c);

  if (!auth?.userId) {
    throw new HTTPException(401, {
      message: 'Unauthorized',
    });
  }

  const [authUser] = await db
    .select()
    .from(auths)
    .where(eq(auths.clerkId, auth.userId));

  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, authUser.userId));

  c.set('auth', authUser);
  c.set('user', dbUser);
  await next();
});
