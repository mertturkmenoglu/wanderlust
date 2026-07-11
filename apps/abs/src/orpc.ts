import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type {
	ContractRouterClient,
	InferContractRouterInputs,
	InferContractRouterOutputs,
} from '@orpc/contract';
import type { AppRouter } from '@wanderlust/contract';

type ClientContext = {
	token?: string;
};

export const link = new RPCLink<ClientContext>({
	// env variable name isn't important. Because it was already defined in .env file for web usage, I reused it here.
	// VITE_ prefix doesn't matter here.
	url: `${import.meta.env.VITE_API_URL}/rpc`,
	headers: (ctx) => ({
		authorization: ctx.context.token
			? `Bearer ${ctx.context.token}`
			: undefined,
	}),
	fetch(url, options) {
		return fetch(url, {
			...options,
			credentials: 'include',
		});
	},
});

export const client: ContractRouterClient<AppRouter> = createORPCClient(link);

export type Inputs = InferContractRouterInputs<AppRouter>;

export type Outputs = InferContractRouterOutputs<AppRouter>;
