import Typesense from 'typesense';
import { Location } from '../db';
import { logger } from '../logger';
import { env } from '../start';
import { schemas } from './schemas';

export const searchClient = new Typesense.Client({
  nodes: [
    {
      host: env.TYPESENSE_HOST,
      port: env.TYPESENSE_PORT,
      protocol: env.TYPESENSE_PROTOCOL,
    },
  ],
  apiKey: env.TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 2,
});

export async function initSearch() {
  logger.info('Creating search collections');

  for (const schema of schemas) {
    const name = schema.name;
    const exists = await searchClient.collections(name).exists();

    if (!exists) {
      await searchClient.collections().create(schema);
    }
  }

  logger.info('Search collections created');
}

export async function upsertLocation(location: Location) {
  await searchClient
    .collections('locations')
    .documents()
    .upsert(
      {
        ...location,
        coordinates: [location.address.lat, location.address.long],
      },
      { action: 'upsert' }
    );
}

export async function deleteLocation(id: string) {
  await searchClient.collections('locations').documents(id).delete();
}
