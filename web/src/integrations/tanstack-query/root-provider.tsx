import { isApiError } from '@/lib/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: (count, error) => {
        if (isApiError(error)) {
          if (
            error.status === 401 ||
            error.status === 403 ||
            error.status === 404
          ) {
            return false;
          }

          return count < 3;
        }

        return count < 3;
      },
    },
    mutations: {
      onError: (err) => {
        if (isApiError(err)) {
          toast.error(err.title ?? 'Something went wrong', {
            description: err.detail ?? 'Unknown error',
            descriptionClassName: 'capitalize',
          });
        } else {
          toast.error('Something went wrong');
        }
      },
    },
  },
});

export function getContext() {
  return {
    queryClient,
  };
}

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
