import { faker } from '@faker-js/faker';
import { data } from '@/fixtures/assets';

export namespace Fake {
	export namespace Chunk {
		export function count(total: number, size: number): number {
			if (size <= 0) {
				return 0;
			}

			let count = Math.floor(total / size);

			if (total % size !== 0) {
				count += 1;
			}

			return count;
		}

		export function fromArray<T>(array: T[], size: number): T[][] {
			const chunks: T[][] = [];

			for (let i = 0; i < array.length; i += size) {
				const chunk = array.slice(i, i + size);
				chunks.push(chunk);
			}

			return chunks;
		}
	}

	export namespace File {
		export const paths = {
			accolades: 'tmp/accolades.txt',
			places: 'tmp/places.txt',
			users: 'tmp/users.txt',
			reviews: 'tmp/reviews.txt',
			collections: 'tmp/collections.txt',
			lists: 'tmp/lists.txt',
		} as const;

		export async function read(
			path: keyof typeof paths & string,
		): Promise<string[]> {
			let realPath: string = path;

			if (Object.hasOwn(paths, path)) {
				realPath = paths[path as keyof typeof paths];
			}

			if (!realPath.startsWith('tmp/')) {
				throw new Error('you must read a file from the tmp/ directory');
			}

			const text = await Bun.file(realPath).text();
			return text.split('\n').filter((line) => line.trim() !== '');
		}
	}

	export namespace Promise {
		export function allMustSettle<T>(results: PromiseSettledResult<T>[]): T[] {
			const values: T[] = [];

			for (const result of results) {
				if (result.status === 'fulfilled') {
					values.push(result.value);
				} else {
					throw new Error(`Promise rejected with reason: ${result.reason}`);
				}
			}

			return values;
		}
	}

	export namespace Random {
		export function imageUrl(): string {
			return `https://picsum.photos/id/${faker.helpers.arrayElement(data)}/960/720`;
		}
	}
}
