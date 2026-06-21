import { createORPCClient, type InferClientInputs, type InferClientOutputs } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { ContractRouterClient } from '@orpc/contract';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import type { AppRouter } from '@wanderlust/contract';

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

export const orpc = createTanstackQueryUtils(client);

export type Inputs = InferClientInputs<typeof client>;

export type Outputs = InferClientOutputs<typeof client>;
