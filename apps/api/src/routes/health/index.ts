import { implement } from '@orpc/server';
import { health } from '@wanderlust/contract';
import type { Context } from '@/lib/context';
import { defineModule } from '@/lib/define-module';

export const module = defineModule({
	exports: [],
	router: () => {
		const os = implement(health.contract).$context<Context>();

		return os.router({
			check: os.check.handler(async () => {
				return {
					message: 'OK',
				};
			}),
		});
	},
});
