import { api } from '@/lib/api';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

export function useDeleteCategoryMutation() {
  const navigate = useNavigate();

  return api.useMutation('delete', '/api/v2/categories/{id}', {
    onSuccess: () => {
      toast.success('Category deleted');
      navigate({ to: '/dashboard/categories' });
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });
}
