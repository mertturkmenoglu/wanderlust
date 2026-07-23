/**
 * Calculates a stable hash for the given value. The hash is stable across different runs of the program.
 *
 * Hashing is done using non-cryptographic methods, so it is not suitable for security purposes.
 *
 * It is intended for use cases like caching, where a stable hash is needed to identify the same data across different runs.
 * @param value - The value to hash. Can be of any type, including objects, arrays, and primitives.
 * @returns A string representing the stable hash of the input value.
 */
export function stableHash(value: unknown): string {
	return Bun.hash(stableStringify(value)).toString(36);
}

/**
 * Stringifies a value in a stable manner, ensuring that the output is consistent across different runs of the program.
 *
 * This function handles various data types, including objects, arrays, and primitives, and ensures that object keys are sorted to maintain stability.
 *
 * @remarks
 * - `undefined` is represented as `'null'`.
 * - `null` and primitive types are stringified using `JSON.stringify`.
 * - `Date` objects are converted to ISO strings.
 * - Arrays are recursively stringified.
 * - Objects have their keys sorted and are recursively stringified.
 * @param value - The value to stringify.
 * @returns A string representing the stable stringification of the input value.
 */
export function stableStringify(value: unknown): string {
	if (value === undefined) {
		return 'null';
	}

	if (value === null || typeof value !== 'object') {
		return JSON.stringify(value);
	}

	if (value instanceof Date) {
		return JSON.stringify(value.toISOString());
	}

	if (Array.isArray(value)) {
		return `[${value.map(stableStringify).join(',')}]`;
	}

	// Sort object keys to ensure stable stringification
	const entries = Object.entries(value as Record<string, unknown>)
		.filter(([, v]) => v !== undefined)
		.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

	const entriesString = entries
		.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`)
		.join(',');

	return `{${entriesString}}`;
}
