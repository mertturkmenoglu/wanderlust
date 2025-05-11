import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type FormInput, schema } from './schema';

export function useStep2Form(draft: any) {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      address: {
        cityId: draft.address?.cityId ?? undefined,
        line1: draft.address?.line1 ?? undefined,
        line2: draft.address?.line2 ?? undefined,
        postalCode: draft.address?.postalCode ?? undefined,
        lat: draft.address?.lat ?? undefined,
        lng: draft.address?.lng ?? undefined,
      },
    },
  });
}
