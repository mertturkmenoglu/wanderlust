import { faker } from '@faker-js/faker';
import e from 'enquirer';
import { logger } from '../../src/logger';
import { CreateLocationDto } from '../../src/routes/locations/dto';

export async function handler() {
  const { count } = await e.prompt<{ count: number }>({
    type: 'numeral',
    message: 'How many do you want to generate?',
    name: 'count',
  });

  if (count <= 0 || count > 10_000) {
    logger.error('Invalid count: must be between 1 and 10,000');
    process.exit(1);
  }

  logger.info(`Generating ${count} locations`);
  const res = await generate(count);
  await write(res);

  logger.info('Fake locations data written to scripts/data/locations.json');
}

async function generate(count: number) {
  const locations: CreateLocationDto[] = [];

  for (let i = 0; i < count; i++) {
    const mediaCount = faker.number.int({ min: 1, max: 5 });
    const tmp = new Array(mediaCount).fill(0);

    const dto: CreateLocationDto = {
      address: {
        country: faker.location.countryCode('alpha-2'),
        city: faker.location.city(),
        line1: faker.location.streetAddress(false),
        line2: faker.location.secondaryAddress(),
        postalCode: faker.location.zipCode(),
        state: faker.location.state(),
        lat: faker.location.latitude(),
        long: faker.location.longitude(),
      },
      name: faker.word.words({ count: { min: 2, max: 5 } }),
      description: faker.lorem.sentences({ min: 2, max: 5 }),
      accessibilityLevel: faker.number.int({ min: 1, max: 5 }),
      hasWifi: faker.datatype.boolean(),
      priceLevel: faker.number.int({ min: 1, max: 5 }),
      tags: faker.helpers.multiple(faker.word.noun, {
        count: { min: 1, max: 5 },
      }),
      website: faker.internet.url(),
      phone: faker.helpers.fromRegExp('[0-9]{3}-[0-9]{3}-[0-9]{4}'),
      categoryId: faker.number.int({ min: 1, max: 16 }),
      media: tmp.map(() => ({
        type: 'image',
        url: faker.image.url(),
        thumbnail: faker.image.url(),
        alt: faker.lorem.words({ min: 2, max: 4 }),
        caption: faker.lorem.sentence(),
        width: faker.number.int({ min: 100, max: 1920 }),
        height: faker.number.int({ min: 100, max: 1080 }),
      })),
    };

    locations.push(dto);
  }

  return locations;
}

async function write(data: CreateLocationDto[]) {
  logger.info(`Generated ${data.length} locations`);
  logger.info('Writing to file...');
  await Bun.write(`scripts/data/locations.json`, JSON.stringify(data, null, 2));
}
