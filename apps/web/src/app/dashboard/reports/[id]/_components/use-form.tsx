import { Report } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const schema = z.object({
  status: z.enum(['pending', 'in_progress', 'resolved']),
  resolvedBy: z.string().uuid().optional(),
  resolveComment: z.string().min(1).max(512).optional(),
});

export type FormInput = z.infer<typeof schema>;

export function useReportForm(report: Report) {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: report.status,
      resolvedBy: report.resolvedBy ?? undefined,
      resolveComment: report.resolveComment ?? undefined,
    },
  });
}
