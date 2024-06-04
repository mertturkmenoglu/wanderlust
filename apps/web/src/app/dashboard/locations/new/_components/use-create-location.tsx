'use client';

import { CreateLocationDto } from '#/routes/locations/dto';
import { api, rpc } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useCreateLocation() {
  const router = useRouter();

  return useMutation({
    mutationKey: ['new-location'],
    mutationFn: async (payload: CreateLocationDto) =>
      rpc(() =>
        api.locations.$post({
          json: payload,
        })
      ),
    onSuccess: () => {
      toast.success('Location created successfully. Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    },
    onError: (e) => {
      toast.error('Failed to create location');
    },
  });
}
