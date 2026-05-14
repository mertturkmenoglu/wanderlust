export async function timeFnAsync<T>(fn: () => Promise<T>): Promise<[T, number]> {
	const start = performance.now();
	const result = await fn();
	const duration = Math.round(performance.now() - start);
	return [result, duration];
}
