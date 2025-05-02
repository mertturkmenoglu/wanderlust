import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { schema, type FormInput } from './-schema';

export function useNewCategoryForm() {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
  });
}

export function useNewCategoryMutation() {
  const navigate = useNavigate();

  return api.useMutation('post', '/api/v2/categories/', {
    onSuccess: () => {
      toast.success('Category created');
      navigate({ to: '/dashboard/categories' });
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });
}
