import { clerkMiddleware } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { authorize, getAuth, rateLimiter } from '../../middlewares';
import { withOffset } from '../../pagination';
import { Env } from '../../start';
import { validateId } from '../dto';
import {
  createReportSchema,
  getReportsQueryParamsSchema,
  updateReportSchema,
} from './dto';
import * as repository from './repository';

const factory = createFactory<Env>();

const getReports = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  authorize({ type: 'read-report' }),
  zValidator('query', getReportsQueryParamsSchema),
  async (c) => {
    const q = c.req.valid('query');
    const paginationParams = withOffset({ page: q.page, pageSize: q.pageSize });

    const { data, pagination } = await repository.getReports(
      q.status,
      paginationParams
    );

    return c.json(
      {
        data,
        pagination,
      },
      200
    );
  }
);

const getReportById = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  authorize({ type: 'read-report' }),
  zValidator('param', validateId),
  async (c) => {
    const { id } = c.req.valid('param');

    const report = await repository.getReportById(id);

    if (!report) {
      throw new HTTPException(404, {
        message: 'Report not found',
      });
    }

    return c.json(
      {
        data: report,
      },
      200
    );
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
    const { id } = c.req.valid('param');

    const deleted = await repository.deleteReport(id);

    if (!deleted) {
      throw new HTTPException(404, {
        message: 'Report not found',
      });
    }

    return c.json(
      {
        message: 'Report deleted',
      },
      200
    );
  }
);

export const reportsRouter = new Hono()
  .get('/', ...getReports)
  .get('/:id', ...getReportById)
  .post('/', ...create)
  .patch('/:id', ...update)
  .delete('/:id', ...deleteReport);
