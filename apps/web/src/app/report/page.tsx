'use client';

import { useSearchParams } from 'next/navigation';
import { z } from 'zod';
import Form from './_components/form';

const paramsSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['review', 'user', 'location', 'event', 'list']),
});

export type ReportInput = z.infer<typeof paramsSchema>;

export default function Page() {
  const searchParams = useSearchParams();
  const params = paramsSchema.parse({
    id: searchParams.get('id'),
    type: searchParams.get('type'),
  });

  return (
    <main className="container mx-auto my-32">
      <h2 className="text-center text-2xl font-bold tracking-tight">
        Report a resource
      </h2>
      <Form {...params} />
    </main>
  );
}
