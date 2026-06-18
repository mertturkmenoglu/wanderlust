import { implement } from '@orpc/server';
import { ContainerModule } from 'inversify';
import { container } from '@/ioc';
import type { Context } from '@/lib/context';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { contract } from './contract';
import { AggregatorRepository } from './repository';
import { AggregatorService } from './service';

export function getRouter() {
	const os = implement(contract).$context<Context>();
	const svc = container.get(AggregatorService);

	return os.use(withErrorNormalization).router({
		home: os.home.handler(async ({ context }) => {
			const userId = context.session?.user?.id || null;
			const result = await svc.home(userId);

			return result;
		}),
	});
}

export const module = new ContainerModule(({ bind }) => {
	bind(AggregatorRepository).toSelf();
	bind(AggregatorService).toSelf();
});
