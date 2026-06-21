import { implement } from '@orpc/server';
import { health } from '@wanderlust/contract';
import type { Context } from '@/lib/context';

export function getRouter() {
	const os = implement(health.contract).$context<Context>();

	return os.router({
		check: os.check.handler(async () => {
			return {
				message: 'OK',
			};
		}),
	});
}
