import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type FormInput, schema } from './schema';

export function useStep3Form(draft: any) {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      amenities: draft.amenities ?? undefined,
    },
  });
}
