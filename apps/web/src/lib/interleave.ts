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

export function* interleaveGen<T>(
	listA: Iterable<T>,
	listB: Iterable<T>,
): Generator<T> {
	const iterA = listA[Symbol.iterator]();
	const iterB = listB[Symbol.iterator]();
	let nextA = iterA.next();
	let nextB = iterB.next();

	while (!nextA.done || !nextB.done) {
		if (!nextA.done) {
			yield nextA.value;
			nextA = iterA.next();
		}
		if (!nextB.done) {
			yield nextB.value;
			nextB = iterB.next();
		}
	}
}
