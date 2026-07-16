import slugify from '@sindresorhus/slugify';

export function normalizeAndSlugify(text: string): string {
	return slugify(text, {
		separator: '_',
		transliterate: true,
	});
}
