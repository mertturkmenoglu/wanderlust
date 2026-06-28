import type { AnyContractRouter } from '@orpc/contract';
import type { ServiceIdentifier } from 'inversify';

type DefineModuleOptions<TRouter extends AnyContractRouter> = {
	exports: ServiceIdentifier[];
	router: () => TRouter;
};

export function defineModule<TRouter extends AnyContractRouter>(
	opts: DefineModuleOptions<TRouter>,
) {
	return opts;
}
