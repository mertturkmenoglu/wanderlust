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
  id: true,
  createdAt: true,
  listId: true,
  index: true,
});

export type CreateListItemDto = z.infer<typeof createListItemSchema>;

export const validateDeleteListItemParams = z.object({
  id: z.string().min(1).uuid(),
  itemId: z.string().min(1).uuid(),
});
