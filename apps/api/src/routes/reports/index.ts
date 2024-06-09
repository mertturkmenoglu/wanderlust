import { clerkMiddleware } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { authorize, getAuth, rateLimiter } from '../../middlewares';
import { Env } from '../../start';
import { validateId, validatePagination } from '../dto';
import { createReportSchema, updateReportSchema } from './dto';

const factory = createFactory<Env>();

const getReports = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  authorize({ type: 'read-report' }),
  zValidator('query', validatePagination),
  async (c) => {
    throw new HTTPException(501, {
      message: 'Not implemented',
    });
  }
);

const getReportById = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  authorize({ type: 'read-report' }),
  zValidator('param', validateId),
  async (c) => {
    throw new HTTPException(501, {
      message: 'Not implemented',
    });
  }
);

const create = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  rateLimiter({ limit: 10 }),
  authorize({ type: 'create-report' }),
  zValidator('json', createReportSchema),
  async (c) => {
    throw new HTTPException(501, {
      message: 'Not implemented',
    });
  }
);

const update = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  authorize({ type: 'update-report' }),
  zValidator('param', validateId),
  zValidator('json', updateReportSchema),
  async (c) => {
    throw new HTTPException(501, {
      message: 'Not implemented',
    });
  }
);

const deleteReport = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  authorize({ type: 'delete-report' }),
  zValidator('param', validateId),
  async (c) => {
    throw new HTTPException(501, {
      message: 'Not implemented',
    });
  }
);

export const reportsRouter = new Hono()
  .get('/', ...getReports)
  .get('/:id', ...getReportById)
  .post('/', ...create)
  .patch('/:id', ...update)
  .delete('/:id', ...deleteReport);
