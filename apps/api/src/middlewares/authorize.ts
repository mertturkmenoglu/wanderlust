import { Context, MiddlewareHandler } from 'hono';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { env, type Env } from '../start';

type AuthorizationFn = (c: Context<Env, any, {}>) => boolean;

type AuthorizationType = keyof typeof mapping;

type Payload = {
  type: AuthorizationType;
};

const isAdmin: AuthorizationFn = (c) => {
  const auth = c.get('auth');
  return auth.id === env.ADMIN_ID;
};

const mapping = {
  'create-location': isAdmin,
  'read-location': () => true,
  'delete-location': isAdmin,
  'update-location': isAdmin,
  'create-event': isAdmin,
  'read-event': () => true,
  'delete-event': isAdmin,
  'update-event': isAdmin,
  'create-address': isAdmin,
  'read-address': () => true,
  'delete-address': isAdmin,
  'update-address': isAdmin,
  'create-bookmark': () => true,
  'read-bookmark': () => true,
  'delete-bookmark': () => true,
  'create-review': () => true,
  'read-review': () => true,
  'delete-review': () => true,
  'update-review': () => true,
  'read-report': isAdmin,
  'create-report': () => true,
  'update-report': isAdmin,
  'delete-report': isAdmin,
  'verify-user': isAdmin,
} as const satisfies Record<string, AuthorizationFn>;

export const authorize = (payload: Payload): MiddlewareHandler => {
  return createMiddleware<Env>(async (c, next) => {
    const fn = mapping[payload.type];
    const ok = fn(c);

    if (ok) {
      await next();
    } else {
      throw new HTTPException(403, {
        message: 'Unauthorized to perform this action',
      });
    }
  });
};
