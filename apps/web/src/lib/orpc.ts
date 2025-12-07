import {
	createORPCClient,
	type InferClientInputs,
	type InferClientOutputs,
	ORPCError,
} from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import type { AppRouterClient } from '@wanderlust/api/routes/index';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
	defaultOptions: {
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

export const link = new RPCLink({
	url: `${import.meta.env.VITE_API_URL}/rpc`,
	fetch(url, options) {
		return fetch(url, {
			...options,
			credentials: 'include',
		});
	},
});

export const client: AppRouterClient = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);

// Re-export types for convenience
export type { AppRouterClient };

export type Inputs = InferClientInputs<AppRouterClient>;

export type Outputs = InferClientOutputs<AppRouterClient>;
