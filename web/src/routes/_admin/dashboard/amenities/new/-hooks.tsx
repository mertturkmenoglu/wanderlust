import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { schema, type FormInput } from './-schema';

export function useNewAmenityForm() {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
  });
}

export function useNewAmenityMutation() {
  const navigate = useNavigate();

  return api.useMutation('post', '/api/v2/amenities/', {
    onSuccess: () => {
      toast.success('Amenity created');
      navigate({ to: '/dashboard/amenities' });
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });
}
