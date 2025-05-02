import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type FormInput, schema } from './-schema';

export function useNewCityForm() {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
  });
}

export function useNewCityMutation() {
  const navigate = useNavigate();

  return api.useMutation('post', '/api/v2/cities/', {
    onSuccess: () => {
      toast.success('City created');
      navigate({ to: '/dashboard/cities', reloadDocument: true });
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });
}
