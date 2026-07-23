/**
 * Taken from Remeda
 * @see https://github.com/remeda/remeda/blob/main/packages/remeda/src/internal/types/IterableContainer.ts
 */
type IterableContainer<T = unknown> = readonly T[] | readonly [];

/**
 * Creates a new list from two supplied lists by pairing up equally-positioned
 * items. The length of the returned list will match the shortest of the two
 * inputs.
 *
 * Inspired by the Remeda library's zip function.
 *
 * @see https://github.com/remeda/remeda/blob/main/packages/remeda/src/zip.ts
 */
export function zip<L extends IterableContainer, R extends IterableContainer>(
	left: L,
	right: R,
): [L[number], R[number]][] {
	const length = Math.min(left.length, right.length);
	const result: [L[number], R[number]][] = new Array(length);

	for (let i = 0; i < length; i++) {
		result[i] = [left[i], right[i]];
	}

	return result;
}
