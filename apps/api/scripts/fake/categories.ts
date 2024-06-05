import { logger } from '../../src/logger';

type Category = {
  id: number;
  name: string;
};

export async function handler() {
  logger.info(`Generating categories. Categories data is static.`);
  const data = await generate();
  await write(data);

  logger.info('Fake categories data written to scripts/data/categories.json');
}

async function generate() {
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
    { id: 17, name: 'Historical Landmarks' },
  ];
}

async function write(data: Category[]) {
  logger.info(`Generated ${data.length} categories`);
  logger.info('Writing to file...');
  await Bun.write(
    `scripts/data/categories.json`,
    JSON.stringify(data, null, 2)
  );
}
