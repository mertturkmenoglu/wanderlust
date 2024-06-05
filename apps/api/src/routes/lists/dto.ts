import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { lists } from '../../db';

export const createListSchema = createInsertSchema(lists).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});

export type CreateListDto = z.infer<typeof createListSchema>;
