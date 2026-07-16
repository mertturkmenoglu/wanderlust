import { describe, expect, test } from 'vitest';
import { extractHashtags } from './hashtags';

describe('Hashtags', () => {
	test.for([
		{
			name: 'mid string',
			input: 'Hello #alice, how are you?',
			expected: [{ type: 'hashtag', value: '#alice', start: 6, end: 12 }],
		},
		{
			name: 'start of a string',
			input: '#alice, how are you?',
			expected: [{ type: 'hashtag', value: '#alice', start: 0, end: 6 }],
		},
		{
			name: 'end of a string',
			input: 'Hello #alice',
			expected: [{ type: 'hashtag', value: '#alice', start: 6, end: 12 }],
		},
		{
			name: 'only hashtag in string',
			input: '#alice',
			expected: [{ type: 'hashtag', value: '#alice', start: 0, end: 6 }],
		},
		{
			name: 'multiple hashtags',
			input: 'Hello #alice and #bella',
			expected: [
				{ type: 'hashtag', value: '#alice', start: 6, end: 12 },
				{ type: 'hashtag', value: '#bella', start: 17, end: 23 },
			],
		},
		{
			name: 'hashtag contains underscore',
			input: 'Hello #alice_bella',
			expected: [{ type: 'hashtag', value: '#alice_bella', start: 6, end: 18 }],
		},
		{
			name: 'hashtag starts with underscore',
			input: 'Hello #_alice',
			expected: [{ type: 'hashtag', value: '#_alice', start: 6, end: 13 }],
		},
		{
			name: 'hashtag ends with underscore',
			input: 'Hello #alice_',
			expected: [{ type: 'hashtag', value: '#alice_', start: 6, end: 13 }],
		},
		{
			name: 'hashtag contains number',
			input: 'Hello #al123ice',
			expected: [{ type: 'hashtag', value: '#al123ice', start: 6, end: 15 }],
		},
		{
			name: 'hashtag starts with number',
			input: 'Hello #123alice',
			expected: [{ type: 'hashtag', value: '#123alice', start: 6, end: 15 }],
		},
		{
			name: 'hashtag ends with number',
			input: 'Hello #alice123',
			expected: [{ type: 'hashtag', value: '#alice123', start: 6, end: 15 }],
		},
		{
			name: 'hashtag contains hyphen',
			input: 'Hello #alice-bella',
			expected: [{ type: 'hashtag', value: '#alice', start: 6, end: 12 }],
		},
		{
			name: 'hashtag contains dot',
			input: 'Hello #alice.bella',
			expected: [{ type: 'hashtag', value: '#alice', start: 6, end: 12 }],
		},
		{
			name: 'hashtag contains special character',
			input: 'Hello #alice$bella',
			expected: [{ type: 'hashtag', value: '#alice', start: 6, end: 12 }],
		},
		{
			name: 'hashtags with trailing punctuation',
			input: 'Hello #alice, how are you?',
			expected: [{ type: 'hashtag', value: '#alice', start: 6, end: 12 }],
		},
		{
			name: 'empty string',
			input: '',
			expected: [],
		},
		{
			name: 'no mention in string',
			input: 'Hello, how are you?',
			expected: [],
		},
		{
			name: '#.alice should not match',
			input: '#.alice',
			expected: [],
		},
		{
			name: '# alice should not match',
			input: '# alice',
			expected: [],
		},
		{
			name: 'alice # bella should not match',
			input: 'alice # bella',
			expected: [],
		},
		{
			name: 'foo@bar.com should not match',
			input: 'foo@bar.com',
			expected: [],
		},
		{
			name: '##alice should match',
			input: '##alice',
			expected: [{ type: 'hashtag', value: '#alice', start: 1, end: 7 }],
		},
		{
			name: 'Unicode characters in hashtag',
			input: 'Hello #josé, how are you?',
			expected: [{ type: 'hashtag', value: '#jos', start: 6, end: 10 }],
		},
		{
			name: 'hashtag is only numbers',
			input: 'Hello #12345, how are you?',
			expected: [{ type: 'hashtag', value: '#12345', start: 6, end: 12 }],
		},
	])('mention extraction: $name', ({ input, expected }) => {
		const result = extractHashtags(input);
		expect(result.length).toEqual(expected.length);

		for (let i = 0; i < expected.length; i++) {
			const expectedHashtag = expected[i];
			const actualHashtag = result[i];

			if (!actualHashtag) {
				throw new Error(
					`Expected hashtag at index ${i} but got undefined. Input: "${input}"`,
				);
			}

			if (!expectedHashtag) {
				throw new Error(
					`Expected hashtag at index ${i} but got undefined. Input: "${input}"`,
				);
			}

			expect(actualHashtag.type).toBe(expectedHashtag.type);
			expect(actualHashtag.value).toBe(expectedHashtag.value);
			expect(actualHashtag.start).toBe(expectedHashtag.start);
			expect(actualHashtag.end).toBe(expectedHashtag.end);
		}
	});
});
