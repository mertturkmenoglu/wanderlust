export const codes = {
	FOREIGN_KEY_VIOLATION: '23503',
	UNIQUE_VIOLATION: '23505',
	CHECK_VIOLATION: '23514',
	NOT_NULL_VIOLATION: '23502',
} as const satisfies Record<string, string>;
