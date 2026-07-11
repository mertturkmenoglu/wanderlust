// https://github.com/alexreardon/tiny-invariant

const isProduction: boolean = process.env.NODE_ENV === 'production';
const prefix: string = 'Invariant failed';

export function invariant(
	// biome-ignore lint/suspicious/noExplicitAny: it's defined as any in the original package.
	condition: any,
	message?: string | (() => string),
): asserts condition {
	if (condition) {
		return;
	}
	// Condition not passed

	// In production we strip the message but still throw
	if (isProduction) {
		throw new Error(prefix);
	}

	// When not in production we allow the message to pass through
	// *This block will be removed in production builds*

	const provided: string | undefined =
		typeof message === 'function' ? message() : message;

	// Options:
	// 1. message provided: `${prefix}: ${provided}`
	// 2. message not provided: prefix
	const value: string = provided ? `${prefix}: ${provided}` : prefix;
	throw new Error(value);
}
