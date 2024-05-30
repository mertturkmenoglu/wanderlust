import { z } from 'zod';

export const validateId = z.object({
  id: z.string().min(1).uuid(),
});

export const validateUsername = z.object({
  username: z.string().min(1),
});

export const validatePagination = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(25),
});
