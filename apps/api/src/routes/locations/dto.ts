import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { locations } from '../../db/schema';

export const createLocationSchema = createInsertSchema(locations).omit({
  id: true,
});

export type CreateLocationDto = z.infer<typeof createLocationSchema>;

export const updateLocationSchema = createInsertSchema(locations)
  .omit({
    id: true,
  })
  .partial();

export type UpdateLocationDto = z.infer<typeof updateLocationSchema>;
