export function isCollectionExistsError(err: unknown): boolean {
	if (err instanceof Error) {
		const isExistsErr = err.message.includes('already exists');
		return isExistsErr;
	}

	return false;
}

export function isCollectionNotFoundError(err: unknown): boolean {
	if (err instanceof Error) {
		const isNotFoundErr = err.message.includes('No collection with name');
		return isNotFoundErr;
	}

	return false;
}
