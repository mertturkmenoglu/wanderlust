import { faker } from '@faker-js/faker';
import e from 'enquirer';
import { logger } from '../src/logger';
import { CreateLocationDto } from '../src/routes/locations/dto';

async function bootstrap() {
  const { type } = await e.prompt<{ type: string }>({
    type: 'select',
    message: 'What do you want to generate?',
    name: 'type',
    choices: ['locations', 'events', 'categories'],
  });

  const { count } = await e.prompt<{ count: number }>({
    type: 'numeral',
    message: 'How many do you want to generate?',
    name: 'count',
  });

  if (count < 0 || count > 10_000 || (type !== 'categories' && count === 0)) {
    console.error('Invalid count');
    process.exit(1);
  }

  logger.info(`Generating ${count} ${type}`);
  let res: any[] = [];

  if (type === 'locations') {
    res = await generateLocations(count);
  } else if (type === 'events') {
    res = await generateEvents(count);
  } else {
    res = await generateCategories();
  }

  logger.info(`Generated ${res.length} ${type}`);
  logger.info('Writing to file...');

  Bun.write(`scripts/data/${type}.json`, JSON.stringify(res, null, 2));

  logger.info('Done!');
}

async function generateLocations(count: number) {
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

async function generateEvents(count: number) {
  logger.error('Not implemented yet.');
  return [];
}

async function generateCategories() {
  return [
    { id: 1, name: 'Coffe Shops' },
    { id: 2, name: 'Restaurants' },
    { id: 3, name: 'Bookstores' },
    { id: 4, name: 'Natural Landmarks' },
    { id: 5, name: 'Breweries' },
    { id: 6, name: 'Bars & Clubs' },
    { id: 7, name: 'Community Hubs' },
    { id: 8, name: 'Co-working Spaces' },
    { id: 9, name: 'Wellness Centers' },
    { id: 10, name: 'Photography Spots' },
    { id: 11, name: 'Artisanal Bakeries' },
    { id: 12, name: 'Street Art & Murals' },
    { id: 13, name: 'Street Food Vendors' },
    { id: 14, name: 'Workshops' },
    { id: 15, name: 'Specialty Shops' },
    { id: 16, name: 'Famous Filming Locations' },
  ];
}

bootstrap();