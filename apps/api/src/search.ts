import { env } from "@/start";
import Typesense from "typesense";

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
  try {
    await searchClient.collections().create({
      name: "users",
      fields: [
        { name: "name", type: "string" },
        { name: "username", type: "string" },
      ],
    });
  } catch (e) {}
}

export const collectionNames = ["users"] as const satisfies string[];
export type CollectionName = (typeof collectionNames)[number];
