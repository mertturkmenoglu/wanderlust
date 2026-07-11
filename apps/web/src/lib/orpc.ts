import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { DedupeRequestsPlugin } from '@orpc/client/plugins';
import type {
	ContractRouterClient,
	InferContractRouterInputs,
	InferContractRouterOutputs,
} from '@orpc/contract';
import {
	createTanstackQueryUtils,
	type RouterUtils,
} from '@orpc/tanstack-query';
import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import type { AppRouter } from '@wanderlust/contract';

const isomorphicLinkFetch = createIsomorphicFn()
	.client(async (url, options) => {
		return fetch(url, {
			...options,
			credentials: 'include',
		});
	})
	.server(async (url, options) => {
		const headers = getRequestHeaders();
		return fetch(url, {
			...options,
			headers,
			credentials: 'include',
		});
	});

const link = new RPCLink({
	url: `${import.meta.env.VITE_API_URL ?? '__vite_api_url_not_defined'}/rpc`,
	fetch: isomorphicLinkFetch,
	plugins: [
		new DedupeRequestsPlugin({
			groups: [
				{
					condition: () => true,
					context: {},
				},
			],
		}),
	],
});

export const client: ContractRouterClient<AppRouter> = createORPCClient(link);

export const orpc: RouterUtils<typeof client> =
	createTanstackQueryUtils(client);

export type Inputs = InferContractRouterInputs<AppRouter>;

export type Outputs = InferContractRouterOutputs<AppRouter>;
