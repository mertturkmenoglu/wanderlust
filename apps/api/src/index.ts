import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { timeout } from 'hono/timeout';
import { runDrizzleMigrations } from './db';
import { initEventHandlers } from './events';
import {
  aggregatorRouter,
  bookmarksRouter,
  categoriesRouter,
  eventsRouter,
  favoritesRouter,
  healthRouter,
  listsRouter,
  locationsRouter,
  reportsRouter,
  reviewsRouter,
  uploadsRouter,
  usersRouter,
  webhooksRouter,
} from './routes';
import { initSearch } from './search';
import { Env, env, getCorsConfig } from './start';
import { initUpload } from './upload';

await runDrizzleMigrations();
await initSearch();
await initUpload();
initEventHandlers();

const app = new Hono<Env>()
  .basePath('/api')
  .use(cors(getCorsConfig()))
  .use(logger())
  .use(secureHeaders())
  .use(timeout(5000))
  .route('/health', healthRouter)
  .route('/webhooks', webhooksRouter)
  .route('/users', usersRouter)
  .route('/locations', locationsRouter)
  .route('/categories', categoriesRouter)
  .route('/events', eventsRouter)
  .route('/bookmarks', bookmarksRouter)
  .route('/reviews', reviewsRouter)
  .route('/uploads', uploadsRouter)
  .route('/lists', listsRouter)
  .route('/favorites', favoritesRouter)
  .route('/reports', reportsRouter)
  .route('/aggregator', aggregatorRouter);

Bun.serve({
  port: env.PORT,
  fetch(req, server) {
    return app.fetch(req, { ip: server.requestIP(req) });
  },
});

export type AppType = typeof app;
