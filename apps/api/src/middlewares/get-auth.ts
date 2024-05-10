import { createMiddleware } from "hono/factory";
import { getAuth as getAuthClerk } from "@hono/clerk-auth";
import { HTTPException } from "hono/http-exception";
import { db } from "../db";
import { auths } from "../db/schema";
import { eq } from "drizzle-orm";
import { Env } from "..";

export const getAuth = createMiddleware<Env>(async (c, next) => {
  const auth = getAuthClerk(c);

  if (!auth?.userId) {
    throw new HTTPException(401, {
      message: "Unauthorized",
    });
  }

  const [authUser] = await db
    .select()
    .from(auths)
    .where(eq(auths.clerkId, auth.userId));

  c.set("auth", authUser);
  await next();
});
