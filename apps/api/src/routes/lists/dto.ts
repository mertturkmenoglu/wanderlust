import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { listItems, lists } from '../../db';

export const createListSchema = createInsertSchema(lists).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});

export type CreateListDto = z.infer<typeof createListSchema>;

export const createListItemSchema = createInsertSchema(listItems).omit({
  createdAt: true,
  listId: true,
});

export type CreateListItemDto = z.infer<typeof createListItemSchema>;
