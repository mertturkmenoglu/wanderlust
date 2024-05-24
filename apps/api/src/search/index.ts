import { Location } from "@/db";
import { env } from "@/start";
import Typesense from "typesense";
import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";
import { schemas } from "./schemas";

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
    await createCollection(schema);
  }
  console.log('Search collections created');
}

async function createCollection(a: CollectionCreateSchema) {
  try {
    await searchClient.collections().create(a);
  } catch (error) {}
}

export async function upsertLocation(location: Location) {
  await searchClient.collections("locations").documents().upsert(location);
}
