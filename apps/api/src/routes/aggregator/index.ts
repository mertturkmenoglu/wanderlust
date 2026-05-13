import { implement } from '@orpc/server';
import { ContainerModule } from 'inversify';
import { container } from '@/ioc';
import type { Context } from '@/lib/context';
import { contract } from './contract';
import { AggregatorRepository } from './repository';
import { AggregatorService } from './service';

export function getRouter() {
	const os = implement(contract).$context<Context>();
	const svc = container.get(AggregatorService);

	return os.router({
		home: os.home.handler(async () => {
			const result = await svc.home();

			return result;
		}),
	});
}

export const module = new ContainerModule(({ bind }) => {
	bind(AggregatorRepository).toSelf();
	bind(AggregatorService).toSelf();
});
