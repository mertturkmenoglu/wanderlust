import { describe, expect, test } from 'vitest';
import { extractAllFacets } from './all';

const fixtures = [
	[
		'hey @alice check out https://example.com about #testing',
		['@alice', 'https://example.com', '#testing'],
	],

	[
		'@bob https://example.com #launch are all here',
		['https://example.com', '#launch'],
	],

	[
		'wrapping up with @carol https://example.com #done',
		['@carol', 'https://example.com', '#done'],
	],

	[
		'@alice @bob @carol #a #b #c https://x.com https://y.com',
		['@alice', '@carol', '#a', '#b', '#c', 'https://x.com', 'https://y.com'],
	],

	['email me at foo@bar.com not @alice', ['foo@bar.com', '@alice']],

	[
		'login at https://user@example.com then ping @dave',
		['https://user@example.com', '@dave'],
	],

	[
		'(@alice), [#topic]! see https://example.com.',
		['@alice', '#topic', 'https://example.com'],
	],

	[
		'thanks [the docs](https://example.com/docs) @alice #docs',
		['https://example.com/docs', '@alice', '#docs'],
	],

	[
		'issue #42 is not #urgent but C# and #1 are tricky',
		['#42', '#urgent', '#1'],
	],

	[
		'@alice.smith pinged @bob. about #v1.2 and #done.',
		['@alice', '#v1', '#done'],
	],

	[
		'visit www.example.com or example.org for @info',
		['www.example.com', 'example.org', '@info'],
	],

	[
		'@josé loves #café at https://münchen.de with @田中 #日本',
		['#caf', 'https://münchen.de'],
	],

	[
		'🎉@alice 🔥#winning 👉https://example.com🚀',
		['@alice', '#winning', 'https://example.com🚀'],
	],

	['meet @ 5pm, price was $#5, path /usr/@/bin, htps://x.com', ['#5', 'x.com']],

	['@ # https:// are all incomplete @, #, and a bare url', []],

	[
		'@@alice ##tag https://https://example.com @bob@carol',
		['@alice', '#tag', 'https://https://example.com'],
	],

	[
		'she said "@alice" and <https://example.com> and "#quoted"',
		['@alice', 'https://example.com', '#quoted'],
	],

	[
		'see https://example.com:8080/search?q=a&p=2#top then @alice',
		['https://example.com:8080/search?q=a&p=2#top', '@alice'],
	],

	[
		'line one @alice\nline two #tag\nline three https://example.com',
		['@alice', '#tag', 'https://example.com'],
	],

	[
		'Big thanks to @alice and @bob for shipping https://example.com/release — tag your bugs with #v2 or email support@example.com, more at www.example.com/help #shipit',
		[
			'@alice',
			'https://example.com/release',
			'#v2',
			'support@example.com',
			'www.example.com/help',
			'#shipit',
		],
	],
];

describe('Rich Text Facet Extraction Test Suite', () => {
	test.for(fixtures)('extracts mentions, hashtags, and links from: %s', ([
		input,
		expected,
	]) => {
		const facets = extractAllFacets(input as string);
		expect(facets.map((facet) => facet.value).toSorted()).toEqual(
			(expected as string[]).toSorted(),
		);
	});
});
