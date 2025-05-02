import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type FormInput, schema } from './-schema';

export function useUpdateCityForm(initialData: FormInput) {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });
}

export function useUpdateCityMutation(id: number) {
  const navigate = useNavigate();

  return api.useMutation('patch', '/api/v2/cities/{id}', {
    onSuccess: () => {
      toast.success('City updated');
      navigate({ to: `/dashboard/cities/${id}`, reloadDocument: true });
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });
}
