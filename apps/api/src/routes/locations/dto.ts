import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { locations } from '../../db/schema';

export const createLocationSchema = createInsertSchema(locations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalPoints: true,
  totalVotes: true,
});

export type CreateLocationDto = z.infer<typeof createLocationSchema>;

export const updateLocationSchema = createInsertSchema(locations)
  .omit({
    id: true,
  })
  .partial();

export type UpdateLocationDto = z.infer<typeof updateLocationSchema>;

export const getStatesSchema = z.object({
  countryId: z.coerce.number().int(),
});

export const getCitiesSchema = z.object({
  countryId: z.coerce.number().int(),
  stateId: z.coerce.number().int(),
});
