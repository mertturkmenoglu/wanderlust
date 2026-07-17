export function areSetsEqual<T>(setA: Set<T>, setB: Set<T>): boolean {
	if (setA.size !== setB.size) {
		return false;
	}

	return setA.isSubsetOf(setB) && setB.isSubsetOf(setA);
}
