import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type FormInput, schema } from './schema';

export function useStep4Form(draft: any) {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      openHours: [],
    },
  });
}
