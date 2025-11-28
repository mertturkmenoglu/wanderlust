import { DbProvider } from "@/db";
import type { AuthContext } from "@/lib/context";
import { ORPCError, os } from "@orpc/server";

export const isAdmin = os
  .$context<AuthContext>()
  .middleware(async ({ context, next }) => {
    const user = context.session?.user;
    if (!user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    const db = context.ioc.resolve(DbProvider.id);

    const admin = await db.query.admins.findFirst({
      where: (t, { eq }) => eq(t.userId, user.id),
    });

    if (!admin) {
      throw new ORPCError("FORBIDDEN");
    }

    return next({
      context,
    });
  });
