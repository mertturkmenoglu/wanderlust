import { implement } from '@orpc/server';
import { container } from '@/ioc';
import type { Context } from '@/lib/context';
import { contract } from './contract';
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
