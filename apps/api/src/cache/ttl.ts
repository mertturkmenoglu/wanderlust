import { CacheKey } from "./keys";

export const cacheTTL = {
  categories: 60 * 60,
  "consectetur-adipiscing-elit": 0,
  "dolor-sit-amet": 0,
  "lorem-ipsum": 0,
} as const satisfies Record<CacheKey, number>;
