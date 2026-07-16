import { describe, expect, test } from 'vitest';
import { createLinkifyInstance } from './link';

// At the moment, this test suite doesn't add much value
// because we are relying on the linkify library which is already tested.
// But it would be useful if we ever make changes in the internals of the createLinkifyInstance function.
// Or, we may use another library/custom implementation in the future.
// In those cases, we can use this test suite to ensure that the rich text extraction is working as expected.
describe('Links', () => {
	const linkify = createLinkifyInstance();

	test.for([
		{
			name: 'empty string',
			input: '',
			expected: [],
		},
		{
			name: 'with protocol',
			input: 'https://example.com',
			expected: [
				{
					type: 'url',
					value: 'https://example.com',
					href: 'https://example.com',
					isLink: true,
					start: 0,
					end: 19,
				},
			],
		},
		{
			name: 'without protocol',
			input: 'example.com',
			expected: [
				{
					type: 'url',
					value: 'example.com',
					href: 'http://example.com',
					isLink: true,
					start: 0,
					end: 11,
				},
			],
		},
		{
			name: 'with www',
			input: 'www.example.com',
			expected: [
				{
					type: 'url',
					value: 'www.example.com',
					href: 'http://www.example.com',
					isLink: true,
					start: 0,
					end: 15,
				},
			],
		},
		{
			name: 'with path',
			input: 'https://example.com/path/to/resource',
			expected: [
				{
					type: 'url',
					value: 'https://example.com/path/to/resource',
					href: 'https://example.com/path/to/resource',
					isLink: true,
					start: 0,
					end: 36,
				},
			],
		},
		{
			name: 'with query parameters',
			input: 'https://example.com/path?query=param',
			expected: [
				{
					type: 'url',
					value: 'https://example.com/path?query=param',
					href: 'https://example.com/path?query=param',
					isLink: true,
					start: 0,
					end: 36,
				},
			],
		},
		{
			name: 'with fragment',
			input: 'https://example.com/path#fragment',
			expected: [
				{
					type: 'url',
					value: 'https://example.com/path#fragment',
					href: 'https://example.com/path#fragment',
					isLink: true,
					start: 0,
					end: 33,
				},
			],
		},
		{
			name: 'with port',
			input: 'https://example.com:8080',
			expected: [
				{
					type: 'url',
					value: 'https://example.com:8080',
					href: 'https://example.com:8080',
					isLink: true,
					start: 0,
					end: 24,
				},
			],
		},
		{
			name: 'with subdomain',
			input: 'https://sub.example.com',
			expected: [
				{
					type: 'url',
					value: 'https://sub.example.com',
					href: 'https://sub.example.com',
					isLink: true,
					start: 0,
					end: 23,
				},
			],
		},
		{
			name: 'no links in string',
			input: 'This is a string with no links.',
			expected: [],
		},
		{
			name: 'whitspace only input',
			input: '   ',
			expected: [],
		},
		{
			name: 'almost a url but it is not valid',
			input: 'http://',
			expected: [],
		},
		{
			name: 'multiple urls in a string',
			input: 'Check out https://example.com and http://test.com for more info.',
			expected: [
				{
					type: 'url',
					value: 'https://example.com',
					href: 'https://example.com',
					isLink: true,
					start: 10,
					end: 29,
				},
				{
					type: 'url',
					value: 'http://test.com',
					href: 'http://test.com',
					isLink: true,
					start: 34,
					end: 49,
				},
			],
		},
		{
			name: 'url with trailing punctuation - dot',
			input: 'Check this out: https://example.com.',
			expected: [
				{
					type: 'url',
					value: 'https://example.com',
					href: 'https://example.com',
					isLink: true,
					start: 16,
					end: 35,
				},
			],
		},
		{
			name: 'url with trailing punctuation - comma',
			input: 'Check this out: https://example.com, it is great.',
			expected: [
				{
					type: 'url',
					value: 'https://example.com',
					href: 'https://example.com',
					isLink: true,
					start: 16,
					end: 35,
				},
			],
		},
		{
			name: 'url with trailing punctuation - exclamation mark',
			input: 'Check this out: https://example.com! It is great.',
			expected: [
				{
					type: 'url',
					value: 'https://example.com',
					href: 'https://example.com',
					isLink: true,
					start: 16,
					end: 35,
				},
			],
		},
		{
			name: 'url with trailing punctuation - question mark',
			input: 'Check this out: https://example.com? It is great.',
			expected: [
				{
					type: 'url',
					value: 'https://example.com',
					href: 'https://example.com',
					isLink: true,
					start: 16,
					end: 35,
				},
			],
		},
		{
			name: 'url with valid paranthesis in the path',
			input: 'https://en.wikipedia.org/wiki/Foo_(bar)',
			expected: [
				{
					type: 'url',
					value: 'https://en.wikipedia.org/wiki/Foo_(bar)',
					href: 'https://en.wikipedia.org/wiki/Foo_(bar)',
					isLink: true,
					start: 0,
					end: 39,
				},
			],
		},
		{
			name: 'URL with bunch of special characters',
			input:
				'https://geohack.toolforge.org/geohack.php?pagename=Griffith_Observatory&params=34_07_6_N_118_18_1.2_W_type:landmark_region:US-CA',
			expected: [
				{
					type: 'url',
					value:
						'https://geohack.toolforge.org/geohack.php?pagename=Griffith_Observatory&params=34_07_6_N_118_18_1.2_W_type:landmark_region:US-CA',
					href: 'https://geohack.toolforge.org/geohack.php?pagename=Griffith_Observatory&params=34_07_6_N_118_18_1.2_W_type:landmark_region:US-CA',
					isLink: true,
					start: 0,
					end: 128,
				},
			],
		},
		{
			name: 'Quotes around URL',
			input: 'Check this out: "https://example.com"',
			expected: [
				{
					type: 'url',
					value: 'https://example.com',
					href: 'https://example.com',
					isLink: true,
					start: 17,
					end: 36,
				},
			],
		},
		{
			name: 'URL followed by a newline',
			input: 'Check this out:\nhttps://example.com\n',
			expected: [
				{
					type: 'url',
					value: 'https://example.com',
					href: 'https://example.com',
					isLink: true,
					start: 16,
					end: 35,
				},
			],
		},
		{
			name: 'URL whitespace URL',
			input: 'https://example.com https://test.com',
			expected: [
				{
					type: 'url',
					value: 'https://example.com',
					href: 'https://example.com',
					isLink: true,
					start: 0,
					end: 19,
				},
				{
					type: 'url',
					value: 'https://test.com',
					href: 'https://test.com',
					isLink: true,
					start: 20,
					end: 36,
				},
			],
		},
		{
			name: 'Protocol relative URL',
			input: 'Check this out: //example.com',
			expected: [
				{
					type: 'url',
					value: 'example.com',
					href: 'http://example.com',
					isLink: true,
					start: 18,
					end: 29,
				},
			],
		},
		{
			name: 'Mailto',
			input: 'Contact us at mailto:example@example.com',
			expected: [
				{
					type: 'url',
					value: 'mailto:example@example.com',
					href: 'mailto:example@example.com',
					isLink: true,
					start: 14,
					end: 40,
				},
			],
		},
		{
			name: 'FTP',
			input: 'ftp://example.com',
			expected: [
				{
					type: 'url',
					value: 'ftp://example.com',
					href: 'ftp://example.com',
					isLink: true,
					start: 0,
					end: 17,
				},
			],
		},
		{
			name: 'File',
			input: 'file:///path/to/file.txt',
			expected: [
				{
					type: 'url',
					value: 'file:///path/to/file.txt',
					href: 'file:///path/to/file.txt',
					isLink: true,
					start: 0,
					end: 24,
				},
			],
		},
		{
			name: 'Very long URL',
			input: `https://example.com/${'a'.repeat(67)}`, // Six seven
			expected: [
				{
					type: 'url',
					value: `https://example.com/${'a'.repeat(67)}`,
					href: `https://example.com/${'a'.repeat(67)}`,
					isLink: true,
					start: 0,
					end: 87,
				},
			],
		},
		{
			name: 'URL with percent-encoding',
			input: 'https://example.com/a%20b',
			expected: [
				{
					type: 'url',
					value: 'https://example.com/a%20b',
					href: 'https://example.com/a%20b',
					isLink: true,
					start: 0,
					end: 25,
				},
			],
		},
		{
			name: 'URL with userinfo',
			input: 'https://user:pass@example.com',
			expected: [
				{
					type: 'url',
					value: 'https://user:pass@example.com',
					href: 'https://user:pass@example.com',
					isLink: true,
					start: 0,
					end: 29,
				},
			],
		},
		{
			name: 'Unicode in the path',
			input: 'https://example.com/café',
			expected: [
				{
					type: 'url',
					value: 'https://example.com/café',
					href: 'https://example.com/café',
					isLink: true,
					start: 0,
					end: 24,
				},
			],
		},
	])('link extraction: $name', ({ input, expected }) => {
		const result = linkify.find(input);
		expect(result).toEqual(expected);
		for (const link of result) {
			expect(link.isLink).toBe(true);
			expect(link.href).toBeDefined();
			expect(link.start).toBeGreaterThanOrEqual(0);
			expect(link.end).toBeGreaterThan(link.start);
			expect(input.slice(link.start, link.end)).toBe(link.value);
		}
	});
});
