import { implement } from '@orpc/server';
import type { Context } from '@/lib/context';
import { amenities } from './consts';
import { contract } from './contract';

export function getRouter() {
	const os = implement(contract).$context<Context>();

	return os.router({
		list: os.list.handler(async () => {
			return {
				amenities,
			};
		}),
	});
}
