import type { ErrorMap } from '@orpc/contract';

/**
 * A constant object that defines a set of common error types used in the application.
 * A route may return any of these errors by default. This is a convenience to avoid having to define the same errors for every route.
 */
export const ERRORS = {
	BAD_REQUEST: {},
	FORBIDDEN: {},
	UNAUTHORIZED: {},
	NOT_FOUND: {},
	CONFLICT: {},
	UNPROCESSABLE_CONTENT: {},
	INTERNAL_SERVER_ERROR: {},
} as const satisfies ErrorMap;
