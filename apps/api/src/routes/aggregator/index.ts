import { implement } from '@orpc/server';
import { Aggregator } from '@wanderlust/contract';
import { container } from '@/ioc';
import type { Context } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { withTracing } from '@/middlewares/with-tracing';
import { AggregatorRepository } from './repository';
import { AggregatorService } from './service';

export const module = defineModule({
	exports: [AggregatorRepository, AggregatorService],
	router: () => {
		const os = implement(Aggregator.Contract)
			.$context<Context>()
			.use(withErrorNormalization)
			.use(withTracing);

		const svc = container.get(AggregatorService);

		return os.router({
			home: os.home.handler(async ({ context }) => {
				const userId = context.session?.user?.id || null;
				const result = await svc.home(userId);

				return result;
			}),
		});
	},
});
