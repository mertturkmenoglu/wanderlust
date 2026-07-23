import type { AnyContractRouter } from '@orpc/contract';
import type { ServiceIdentifier } from 'inversify';

/**
 * Defines a module with a router and its exported services.
 *
 * @param opts - The options for defining the module.
 * @returns The defined module options.
 */
type DefineModuleOptions<TRouter extends AnyContractRouter> = {
	/**
	 * The services that are exported by this module.
	 */
	exports: ServiceIdentifier[];
	/**
	 * oRPC router for this module.
	 */
	router: () => TRouter;
};

export function defineModule<TRouter extends AnyContractRouter>(
	opts: DefineModuleOptions<TRouter>,
) {
	return opts;
}
