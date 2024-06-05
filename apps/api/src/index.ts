import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { runDrizzleMigrations } from './db';
import { initEventHandlers } from './events';
import {
  bookmarksRouter,
  categoriesRouter,
  eventsRouter,
  healthRouter,
  listsRouter,
  locationsRouter,
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
  .route('/health', healthRouter)
  .route('/webhooks', webhooksRouter)
  .route('/users', usersRouter)
  .route('/locations', locationsRouter)
  .route('/categories', categoriesRouter)
  .route('/events', eventsRouter)
  .route('/bookmarks', bookmarksRouter)
  .route('/reviews', reviewsRouter)
  .route('/uploads', uploadsRouter)
  .route('/lists', listsRouter);

Bun.serve({
  port: env.PORT,
  fetch(req, server) {
    return app.fetch(req, { ip: server.requestIP(req) });
  },
});

export type AppType = typeof app;
