import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { schema, type FormInput } from './-schema';

export function useUpdateCategoryForm(initialData: FormInput) {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });
}

export function useUpdateCategoryMutation(id: number) {
  const navigate = useNavigate();

  return api.useMutation('patch', '/api/v2/categories/{id}', {
    onSuccess: async () => {
      toast.success('Category updated');
      navigate({ to: `/dashboard/categories/${id}`, reloadDocument: true });
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });
}
