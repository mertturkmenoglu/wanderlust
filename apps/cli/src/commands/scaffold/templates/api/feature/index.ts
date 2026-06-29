export const template = `
import { implement } from '@orpc/server';
import { {{feature}} } from '@wanderlust/contract';
import { container } from '@/ioc';
import type { Context } from '@/lib/context';
import { defineModule } from '@/lib/define-module';
import { withErrorNormalization } from '@/middlewares/with-error-normalization';
import { {{Feature}}Repository } from './repository';
import { {{Feature}}Service } from './service';

export const module = defineModule({
	exports: [{{Feature}}Service, {{Feature}}Repository],
	router: () => {
		const os = implement({{feature}}.contract)
			.$context<Context>()
			.use(withErrorNormalization);

		const svc = container.get({{Feature}}Service);

		return os.router({
			get: os.get.handler(async ({ input, context }) => {
				const userId = context.session?.user?.id ?? null;
				const result = await svc.get(userId, input);

				return result;
			}),
		});
	},
});
`;
