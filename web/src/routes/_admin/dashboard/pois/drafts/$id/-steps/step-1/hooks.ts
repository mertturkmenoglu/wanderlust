import type { components } from '@/lib/api-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type FormInput, schema } from './schema';

export function useStep1Form(
  draft: components['schemas']['GetPoiDraftOutputBody']['draft'],
) {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: (draft.name as string | null | undefined) ?? undefined,
      description:
        (draft.description as string | null | undefined) ?? undefined,
      phone: (draft.phone as string | null | undefined) ?? undefined,
      website: (draft.website as string | null | undefined) ?? undefined,
      priceLevel: (draft.priceLevel as number | null | undefined) ?? undefined,
      accessibilityLevel:
        (draft.accessibilityLevel as number | null | undefined) ?? undefined,
      categoryId: (draft.categoryId as number | null | undefined) ?? undefined,
    },
  });
}
