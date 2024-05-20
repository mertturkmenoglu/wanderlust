import { getAuth as getAuthClerk } from "@hono/clerk-auth";
import { eq } from "drizzle-orm";
import { createMiddleware } from "hono/factory";
import { db } from "../db";
import { auths } from "../db/schema";
import { Env } from "../runtime";

/**
 * Check the auth status of user.
 *
 * If user is authenticated, `withAuth` environment variable is set as the database user.
 *
 * Else, `withAuth` is undefined.
 *
 * Use it after the `clerkMiddleware` from the `@hono/clerk-auth` package
 *
 */
export const withAuth = createMiddleware<Env>(async (c, next) => {
  const auth = getAuthClerk(c);

  if (!auth || !auth.userId) {
    c.set("withAuth", undefined);
  } else {
    const [authUser] = await db
      .select()
      .from(auths)
      .where(eq(auths.clerkId, auth.userId));

    c.set("auth", authUser);
  }

  await next();
});
