import { count } from 'drizzle-orm';
import e from 'enquirer';
import { db, locations } from '../src/db';
import { logger } from '../src/logger';
import * as search from '../src/search';

async function bootstrap() {
  const { type } = await e.prompt<{ type: string }>({
    type: 'select',
    name: 'type',
    message: 'What resource do you want to sync?',
    choices: ['locations'],
  });

  switch (type) {
    case 'locations': {
      await syncLocations();
      break;
    }
    default: {
      logger.error('Invalid type');
      process.exit(1);
    }
  }

  logger.info('Sync completed');
  process.exit(0);
}

async function syncLocations() {
  logger.info('Syncing locations');
  console.time('locations sync timer');

  const [{ value }] = await db.select({ value: count() }).from(locations);
  const step = Math.floor(Math.sqrt(Math.sqrt(value)));
  logger.info(`Found ${value} locations in database.`);
  logger.info(`Going to take ${step} locations at a time.`);
  logger.info('Starting sync');

  let offset = 0;
  let i = 0;

  while (offset <= value) {
    logger.info(`Fetching locations from database. Offset: ${offset}`);

    const locationsRes = await db
      .select()
      .from(locations)
      .offset(offset)
      .limit(step);

    for (const location of locationsRes) {
      logger.info(`Upserting location ${i + 1}`);
      await search.upsertLocation(location);
      i++;
    }

    offset += step;
  }

  logger.info('Sync locations completed');
  console.timeEnd('locations sync timer');
}

bootstrap();
