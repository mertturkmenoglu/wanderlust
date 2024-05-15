import { Context, MiddlewareHandler } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { Env } from "..";
import env from "../env";

type AuthorizationFn = (c: Context<Env, any, {}>) => boolean;

type AuthorizationType = keyof typeof mapping;

type Options = {
  type: AuthorizationType;
};

const isAdmin: AuthorizationFn = (c) => {
  const auth = c.get("auth");
  return auth.id === env.ADMIN_ID;
};

const mapping = {
  "create-point": isAdmin,
  "read-point": () => true,
  "delete-point": isAdmin,
  "update-point": isAdmin,
} as const satisfies Record<string, AuthorizationFn>;

export const authorize = (options: Options): MiddlewareHandler => {
  return createMiddleware<Env>(async (c, next) => {
    const ok = mapping[options.type](c);

    if (ok) {
      await next();
    } else {
      throw new HTTPException(403, {
        message: "Unauthorized to perform this action",
      });
    }
  });
};
