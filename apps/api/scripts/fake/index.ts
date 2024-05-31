import e from 'enquirer';
import { logger } from '../../src/logger';
import { handler as bookmarksHandler } from './bookmarks';
import { handler as categoriesHandler } from './categories';
import { handler as eventsHandler } from './events';
import { handler as locationsHandler } from './locations';
import { handler as reviewsHandler } from './reviews';

async function bootstrap() {
  const { type } = await e.prompt<{ type: string }>({
    type: 'select',
    message: 'What do you want to generate?',
    name: 'type',
    choices: ['locations', 'events', 'categories', 'reviews', 'bookmarks'],
  });

  switch (type) {
    case 'locations':
      await locationsHandler();
      break;
    case 'events':
      await eventsHandler();
      break;
    case 'categories':
      await categoriesHandler();
      break;
    case 'reviews':
      await reviewsHandler();
      break;
    case 'bookmarks':
      await bookmarksHandler();
      break;
    default:
      logger.error('Invalid type');
  }

  logger.info('Exiting fake data generator script');
  process.exit(0);
}

bootstrap();
