import { cliui } from '@poppinss/cliui';
import e from 'enquirer';
import { hc } from 'hono/client';
import { AppType } from '../src';
import { CreateLocationDto } from '../src/routes/locations/dto';

const ui = cliui();

const client = hc<AppType>(`http://localhost:${Bun.env.PORT}`);

async function bootstrap() {
  const loader = ui.logger.await('checking server', { suffix: 'npm i' });
  loader.start();

  try {
    const res = await client.api.health.$get();

    if (!res.ok) {
      throw new Error('Cannot reach server');
    }

    loader.stop();
    ui.logger.success('Server is running');
  } catch (error) {
    loader.stop();
    ui.logger.error('Server is not running');
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
    ui.logger.error('Not implemented');
  }
}

async function seedLocations(jwt: string) {
  const file = Bun.file('scripts/data/locations.json');

  if (!file.exists()) {
    ui.logger.error('No locations data found');
    process.exit(1);
  }

  const dtos: CreateLocationDto[] = await file.json();

  ui.logger.info(`Seeding ${dtos.length} locations`);
  let i = 1;

  for (const dto of dtos) {
    ui.logger.info(`Seeding location ${i}/${dtos.length}`);
    const res = await client.api.locations.$post({ json: dto }, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!res.ok) {
      ui.logger.error(
        `Failed to seed location. Reason: ${res.status} ${res.statusText}`
      );
      process.exit(1);
    }

    ui.logger.success('Seeded location');
    i++;
  }

  ui.logger.success('Seeded all locations');
}

bootstrap();
