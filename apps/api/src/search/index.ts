import Typesense from 'typesense';
import { Location } from '../db';
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
  console.log('Creating search collections');

  for (const schema of schemas) {
    const name = schema.name;
    const exists = await searchClient.collections(name).exists();

    if (!exists) {
      await searchClient.collections().create(schema);
    }
  }

  console.log('Search collections created');
}

export async function upsertLocation(location: Location) {
  await searchClient
    .collections('locations')
    .documents()
    .upsert(location, { action: 'upsert' });
}

export async function deleteLocation(id: string) {
  await searchClient.collections('locations').documents(id).delete();
}
