import { api } from '@/lib/api';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

export function useDeleteCityMutation() {
  const navigate = useNavigate();

  return api.useMutation('delete', '/api/v2/cities/{id}', {
    onSuccess: () => {
      toast.success('City deleted');
      navigate({ to: '/dashboard/cities', reloadDocument: true });
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });
}
