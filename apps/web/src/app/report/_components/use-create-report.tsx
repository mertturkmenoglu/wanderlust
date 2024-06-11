import { api, rpc } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FormInput } from './schema';

export function useCreateReport() {
  const router = useRouter();

  return useMutation({
    mutationKey: ['create-report'],
    mutationFn: async (data: FormInput) => {
      rpc(() =>
        api.reports.$post({
          json: data,
        })
      );
    },
    onSuccess: () => {
      router.push('/report/success');
    },
    onError: () => {
      toast.error('Something went wrong. Cannot create a report.');
    },
  });
}
