import e from 'enquirer';
import { hc } from 'hono/client';
import { AppType } from '../src';
import { logger } from '../src/logger';
import { CreateLocationDto } from '../src/routes/locations/dto';

const client = hc<AppType>(`http://localhost:${Bun.env.PORT}`);

async function bootstrap() {
  logger.warn('checking server', { suffix: 'npm i' });

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

  const { type } = await e.prompt<{ type: string }>({
    type: 'select',
    message: 'What do you want to seed?',
    name: 'type',
    choices: ['locations', 'events', 'categories'],
  });

  const { jwt } = await e.prompt<{ jwt: string }>({
    type: 'input',
    message: 'Enter your JWT token (without Bearer)',
    name: 'jwt',
  });

  if (type === 'locations') {
    await seedLocations(jwt);
  } else {
    logger.error('Not implemented');
  }
}

async function seedLocations(jwt: string) {
  const file = Bun.file('scripts/data/locations.json');

  if (!file.exists()) {
    logger.error('No locations data found');
    process.exit(1);
  }

  const dtos: CreateLocationDto[] = await file.json();

  logger.info(`Seeding ${dtos.length} locations`);
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

  logger.info('Seeded all locations');
}

bootstrap();
