import { ORPCError } from '@orpc/client';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function createQueryClient() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000, // 1 minute
			},
			mutations: {
				onError: (e) => {
					if (e instanceof ORPCError) {
						toast.error(e.message);
					} else {
						toast.error('Something happened');
					}
				},
			},
		},
		queryCache: new QueryCache({
			onError: (error) => {
				toast.error(`Error: ${error.message}`, {
					action: {
						label: 'retry',
						onClick: () => {
							queryClient.invalidateQueries();
						},
					},
				});
			},
		}),
	});

	return queryClient;
}
