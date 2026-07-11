export function interleave<T>(listA: T[], listB: T[]): T[] {
	const result: T[] = [];
	const maxLength = Math.max(listA.length, listB.length);

	for (let i = 0; i < maxLength; i++) {
		if (i < listA.length) {
			result.push(listA[i]);
		}
		if (i < listB.length) {
			result.push(listB[i]);
		}
	}

	return result;
}
