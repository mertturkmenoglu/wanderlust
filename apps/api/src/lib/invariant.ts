import type { ORPCErrorCode, ORPCErrorOptions } from '@orpc/client';
import { ORPCError } from '@orpc/server';

// https://github.com/alexreardon/tiny-invariant
export function invariant<T>(
	// biome-ignore lint/suspicious/noExplicitAny: it's defined as any in the original package.
	condition: any,
	code: ORPCErrorCode,
	opts: string | ORPCErrorOptions<T>,
): asserts condition {
	if (condition) {
		return;
	}

	if (typeof opts === 'string') {
		throw new ORPCError(code, {
			message: opts,
		});
	}

	throw new ORPCError(code, opts);
}
