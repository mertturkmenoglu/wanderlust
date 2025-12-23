import { implement } from '@orpc/server';
import type { Context } from '@/lib/context';
import { contract } from './contract';

export function getRouter() {
	const os = implement(contract).$context<Context>();

	return os.router({
		check: os.check.handler(async () => {
			return {
				message: 'OK',
			};
		}),
	});
}
