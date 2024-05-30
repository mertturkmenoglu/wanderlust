import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { bookmarks } from '../../db';

export const createBookmarkSchema = createInsertSchema(bookmarks).omit({
  userId: true,
  createdAt: true,
});

export type CreateBookmarkDto = z.infer<typeof createBookmarkSchema>;
