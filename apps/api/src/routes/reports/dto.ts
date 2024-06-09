import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { reports } from '../../db';

export const createReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
  reporterId: true,
  resolveComment: true,
  resolvedAt: true,
  resolvedBy: true,
  status: true,
});

export type CreateReportDto = z.infer<typeof createReportSchema>;

export const updateReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
  reporterId: true,
  comment: true,
  reason: true,
  targetId: true,
  targetType: true,
});

export type UpdateReportDto = z.infer<typeof updateReportSchema>;
