import { createORPCClient, ORPCError } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type {
	ContractRouterClient,
	InferContractRouterInputs,
	InferContractRouterOutputs,
} from '@orpc/contract';
import {
	createTanstackQueryUtils,
	type RouterUtils,
} from '@orpc/tanstack-query';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import type { AppRouter } from '@wanderlust/contract';
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

export const client: ContractRouterClient<AppRouter> = createORPCClient(link);

export const orpc: RouterUtils<typeof client> =
	createTanstackQueryUtils(client);

export type Inputs = InferContractRouterInputs<AppRouter>;

export type Outputs = InferContractRouterOutputs<AppRouter>;
