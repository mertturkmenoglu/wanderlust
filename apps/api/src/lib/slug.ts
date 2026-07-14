import shSlugify from '@sindresorhus/slugify';
import { nanoid } from '@wanderlust/uid';

export function slugifyWithRandom(input: string): string {
	if (input === '') {
		return nanoid(4);
	}

	const slug = shSlugify(input, {
		separator: '-',
		lowercase: true,
		decamelize: true,
	});

	const rand = nanoid(4);

	return `${slug}-${rand}`;
}
