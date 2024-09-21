import { getCities } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { FormInput, schema } from './schema';

export function useNewPoiForm() {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
  });
}

export function useCitiesQuery() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async () => getCities(),
  });
}
