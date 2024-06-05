import e from 'enquirer';
import { hc } from 'hono/client';
import { AppType } from '../src';
import { categories, db } from '../src/db';
import { logger } from '../src/logger';
import { CreateLocationDto } from '../src/routes/locations/dto';

const client = hc<AppType>(`http://localhost:${Bun.env.PORT}`);

async function checkServer() {
  logger.warn('checking server');

  try {
    const res = await client.api.health.$get();

    if (!res.ok) {
      throw new Error('Cannot reach server');
    }

    logger.info('Server is running');
  } catch (error) {
    logger.error('Server is not running');
    process.exit(1);
  }
}

async function bootstrap() {
  await checkServer();

  console.log();

  const { type } = await e.prompt<{ type: string }>({
    type: 'select',
    message: 'What do you want to seed?',
    name: 'type',
    choices: ['locations', 'events', 'categories'],
  });

  const jwt = Bun.env.TEST_JWT;

  if (!jwt) {
    logger.error(
      'TEST_JWT not found in your environment variables. Exiting...'
    );
    process.exit(1);
  }

  if (type === 'locations') {
    await seedLocations(jwt);
  } else if (type === 'categories') {
    await seedCategories();
  } else {
    logger.error('Not implemented');
  }
}

async function seedLocations(jwt: string) {
  const path = 'scripts/data/locations.json';
  logger.info(`Reading locations data from: ${path}`);
  const file = Bun.file(path);

  if (!file.exists()) {
    logger.error(`Cannot find locations data file at ${path}. Exiting...`);
    process.exit(1);
  }

  const dtos: CreateLocationDto[] = await file.json();

  logger.info(`Seeding ${dtos.length} locations`);
  console.time('seed-locations');
  let i = 1;

  for (const dto of dtos) {
    logger.info(`Seeding location ${i}/${dtos.length}`);
    const res = await client.api.locations.$post(
      { json: dto },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (!res.ok) {
      logger.error(
        `Failed to seed location. Reason: ${res.status} ${res.statusText}`
      );
      process.exit(1);
    }

    logger.info('Seeded location');
    i++;
  }

  console.timeEnd('seed-locations');

  logger.info('Seeded all locations');
}

type Category = {
  id: number;
  name: string;
};

async function seedCategories() {
  const path = 'scripts/data/categories.json';
  logger.info(`Reading categories data from: ${path}`);
  const file = Bun.file(path);

  if (!file.exists()) {
    logger.error(`Cannot find categories data file at ${path}. Exiting...`);
    process.exit(1);
  }

  const dtos: Category[] = await file.json();

  logger.info(`Seeding ${dtos.length} categories`);
  console.time('seed-categories');
  let i = 1;

  for (const dto of dtos) {
    logger.info(`Seeding category ${i}/${dtos.length}`);
    await db.insert(categories).values(dto);

    logger.info('Seeded category');
    i++;
  }

  console.timeEnd('seed-categories');
  logger.info('Seeded all categories');
}

bootstrap();
