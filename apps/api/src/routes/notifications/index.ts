import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { Env } from '../../start';

const factory = createFactory<Env>();

const getAllNotifications = factory.createHandlers((c) => {
  throw new HTTPException(501, {
    message: 'Not Implemented',
  });
});

const getUnreadNotifications = factory.createHandlers((c) => {
  throw new HTTPException(501, {
    message: 'Not Implemented',
  });
});

const readAllNotifications = factory.createHandlers((c) => {
  throw new HTTPException(501, {
    message: 'Not Implemented',
  });
});

const readNotification = factory.createHandlers((c) => {
  throw new HTTPException(501, {
    message: 'Not Implemented',
  });
});

const unreadAllNotifications = factory.createHandlers((c) => {
  throw new HTTPException(501, {
    message: 'Not Implemented',
  });
});

const unreadNotification = factory.createHandlers((c) => {
  throw new HTTPException(501, {
    message: 'Not Implemented',
  });
});

const deleteAllNotifications = factory.createHandlers((c) => {
  throw new HTTPException(501, {
    message: 'Not Implemented',
  });
});

const deleteReadNotifications = factory.createHandlers((c) => {
  throw new HTTPException(501, {
    message: 'Not Implemented',
  });
});

export const notificationsRouter = new Hono()
  .get('/', ...getAllNotifications)
  .get('/unread', ...getUnreadNotifications)
  .post('/read', ...readAllNotifications)
  .post('/read/:id', ...readNotification)
  .post('/unread', ...unreadAllNotifications)
  .post('/unread/:id', ...unreadNotification)
  .delete('/', ...deleteAllNotifications)
  .delete('/read', ...deleteReadNotifications);
