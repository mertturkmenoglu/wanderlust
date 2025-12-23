export function chunkCount(total: number, size: number): number {
	if (size <= 0) {
		return 0;
	}

	let count = Math.floor(total / size);

	if (total % size !== 0) {
		count += 1;
	}

	return count;
}

export function chunkArray<T>(array: T[], size: number): T[][] {
	const chunks: T[][] = [];

	for (let i = 0; i < array.length; i += size) {
		const chunk = array.slice(i, i + size);
		chunks.push(chunk);
	}

	return chunks;
}

export async function readFile(path: string): Promise<string[]> {
	if (!path.startsWith('tmp/')) {
		throw new Error('you must read a file from the tmp/ directory');
	}

	const text = await Bun.file(path).text();
	return text.split('\n').filter((line) => line.trim() !== '');
}
