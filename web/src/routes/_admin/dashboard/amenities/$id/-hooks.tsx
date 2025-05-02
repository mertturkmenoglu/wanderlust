import { api } from '@/lib/api';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

export function useDeleteAmenityMutation() {
  const navigate = useNavigate();

  return api.useMutation('delete', '/api/v2/amenities/{id}', {
    onSuccess: () => {
      toast.success('Amenity deleted');
      navigate({ to: '/dashboard/amenities' });
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });
}
