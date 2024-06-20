import { clerkMiddleware } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { authorize, getAuth, rateLimiter, withAuth } from '../../middlewares';
import { withOffset } from '../../pagination';
import { Env } from '../../start';
import { validatePagination, validateUsername } from '../dto';
import { updateProfileSchema } from './dto';
import * as repository from './repository';

const factory = createFactory<Env>();

const getMe = factory.createHandlers(clerkMiddleware(), getAuth, async (c) => {
  const user = c.get('user');

  return c.json(
    {
      data: user,
    },
    200
  );
});

const getProfileByUsername = factory.createHandlers(
  clerkMiddleware(),
  withAuth,
  zValidator('param', validateUsername),
  async (c) => {
    const auth = c.get('withAuth');
    const { username } = c.req.valid('param');
    const { data, metadata } = await repository.getByUsername(
      username,
      auth?.userId
    );

    return c.json(
      {
        data,
        metadata,
      },
      200
    );
  }
);

const updateProfile = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('json', updateProfileSchema),
  async (c) => {
    const user = c.get('user');
    const dto = c.req.valid('json');

    const updatedUser = await repository.updateProfile(user.id, dto);

    return c.json(
      {
        data: updatedUser,
      },
      200
    );
  }
);

const follow = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('param', validateUsername),
  async (c) => {
    const { username: targetUsername } = c.req.valid('param');
    const user = c.get('user');
    const { data: targetUser } = await repository.getByUsername(targetUsername);

    if (!targetUser) {
      throw new HTTPException(404, {
        message: 'User not found',
      });
    }

    try {
      await repository.follow(user.id, targetUser.id);

      return c.json(
        {
          data: 'OK',
        },
        201
      );
    } catch (e) {
      throw new HTTPException(400, {
        message: 'Already following',
      });
    }
  }
);

const unfollow = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('param', validateUsername),
  async (c) => {
    const { username: targetUsername } = c.req.valid('param');
    const user = c.get('user');
    const { data: targetUser } = await repository.getByUsername(targetUsername);

    if (!targetUser) {
      throw new HTTPException(404, {
        message: 'User not found',
      });
    }

    try {
      await repository.unfollow(user.id, targetUser.id);

      return c.json(
        {
          data: 'OK',
        },
        200
      );
    } catch (e) {
      throw new HTTPException(400, {
        message: 'Not following',
      });
    }
  }
);

const verifyUser = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator('param', validateUsername),
  authorize({ type: 'verify-user' }),
  async (c) => {
    const { username } = c.req.valid('param');

    const ok = await repository.makeUserVerified(username);

    if (!ok) {
      throw new HTTPException(400, {
        message: 'Cannot make user verified',
      });
    }

    return c.json(
      {
        data: 'OK',
      },
      200
    );
  }
);

const getFollowers = factory.createHandlers(
  zValidator('param', validateUsername),
  zValidator('query', validatePagination),
  async (c) => {
    const { username } = c.req.valid('param');
    const pagination = withOffset(c.req.valid('query'));
    const result = await repository.getFollowers(username, pagination);

    return c.json(
      {
        data: result.data,
        pagination: result.pagination,
      },
      200
    );
  }
);

const getFollowing = factory.createHandlers(
  zValidator('param', validateUsername),
  zValidator('query', validatePagination),
  async (c) => {
    const { username } = c.req.valid('param');
    const pagination = withOffset(c.req.valid('query'));
    const result = await repository.getFollowing(username, pagination);

    return c.json(
      {
        data: result.data,
        pagination: result.pagination,
      },
      200
    );
  }
);

export const usersRouter = new Hono()
  .use(rateLimiter())
  .get('/me', ...getMe)
  .get('/:username/profile', ...getProfileByUsername)
  .get('/:username/followers', ...getFollowers)
  .get('/:username/following', ...getFollowing)
  .patch('/profile', ...updateProfile)
  .post('/follow/:username', ...follow)
  .post('/unfollow/:username', ...unfollow)
  .patch('/verify/:username', ...verifyUser);
