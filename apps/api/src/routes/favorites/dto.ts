import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { favorites } from '../../db';

export const createFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  profileIndex: true,
  userId: true,
  createdAt: true,
});

export type CreateFavoriteDto = z.infer<typeof createFavoriteSchema>;
