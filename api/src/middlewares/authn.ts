import type { Context } from "@/lib/context";
import { ORPCError, os } from "@orpc/server";

export const requireAuth = os
  .$context<Context>()
  .middleware(async ({ context, next }) => {
    if (!context.session?.user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    return next({
      context,
    });
  });
