import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { isApiError } from '@/lib/api';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: Number.POSITIVE_INFINITY,
			staleTime: Number.POSITIVE_INFINITY,
			refetchOnWindowFocus: false,
			retry: false,
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

function getContext() {
	return {
		queryClient,
	};
}

function Provider({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

export { getContext, Provider };
