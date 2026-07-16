import { describe, expect, test } from 'vitest';
import { extractMentions } from './mentions';

describe('Mentions', () => {
	test.for([
		{
			name: 'mid string',
			input: 'Hello @alice, how are you?',
			expected: [{ type: 'mention', value: '@alice', start: 6, end: 12 }],
		},
		{
			name: 'start of a string',
			input: '@alice, how are you?',
			expected: [{ type: 'mention', value: '@alice', start: 0, end: 6 }],
		},
		{
			name: 'end of a string',
			input: 'Hello @alice',
			expected: [{ type: 'mention', value: '@alice', start: 6, end: 12 }],
		},
		{
			name: 'only mention in string',
			input: '@alice',
			expected: [{ type: 'mention', value: '@alice', start: 0, end: 6 }],
		},
		{
			name: 'multiple mentions',
			input: 'Hello @alice and @bella',
			expected: [
				{ type: 'mention', value: '@alice', start: 6, end: 12 },
				{ type: 'mention', value: '@bella', start: 17, end: 23 },
			],
		},
		{
			name: 'username contains underscore',
			input: 'Hello @alice_bella',
			expected: [{ type: 'mention', value: '@alice_bella', start: 6, end: 18 }],
		},
		{
			name: 'username starts with underscore',
			input: 'Hello @_alice',
			expected: [],
		},
		{
			name: 'username ends with underscore',
			input: 'Hello @alice_',
			expected: [{ type: 'mention', value: '@alice_', start: 6, end: 13 }],
		},
		{
			name: 'username contains number',
			input: 'Hello @al123ice',
			expected: [{ type: 'mention', value: '@al123ice', start: 6, end: 15 }],
		},
		{
			name: 'username starts with number',
			input: 'Hello @123alice',
			expected: [],
		},
		{
			name: 'username ends with number',
			input: 'Hello @alice123',
			expected: [{ type: 'mention', value: '@alice123', start: 6, end: 15 }],
		},
		{
			name: 'username contains hyphen',
			input: 'Hello @alice-bella',
			expected: [{ type: 'mention', value: '@alice', start: 6, end: 12 }],
		},
		{
			name: 'username contains dot',
			input: 'Hello @alice.bella',
			expected: [{ type: 'mention', value: '@alice', start: 6, end: 12 }],
		},
		{
			name: 'username contains special character',
			input: 'Hello @alice$bella',
			expected: [{ type: 'mention', value: '@alice', start: 6, end: 12 }],
		},
		{
			name: 'mentions with trailing punctuation',
			input: 'Hello @alice, how are you?',
			expected: [{ type: 'mention', value: '@alice', start: 6, end: 12 }],
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
			name: '@.alice should not match',
			input: '@.alice',
			expected: [],
		},
		{
			name: '@ alice should not match',
			input: '@ alice',
			expected: [],
		},
		{
			name: 'alice @ bella should not match',
			input: 'alice @ bella',
			expected: [],
		},
		{
			name: 'foo@bar.com should not match',
			input: 'foo@bar.com',
			expected: [],
		},
		{
			name: '@@alice should match',
			input: '@@alice',
			expected: [{ type: 'mention', value: '@alice', start: 1, end: 7 }],
		},
		{
			name: 'Unicode characters in username',
			input: 'Hello @josé, how are you?',
			expected: [],
		},
		{
			name: 'username is only numbers',
			input: 'Hello @12345, how are you?',
			expected: [],
		},
	])('mention extraction: $name', ({ input, expected }) => {
		const result = extractMentions(input);
		expect(result.length).toEqual(expected.length);

		for (let i = 0; i < expected.length; i++) {
			const expectedMention = expected[i];
			const actualMention = result[i];

			if (!actualMention) {
				throw new Error(
					`Expected mention at index ${i} but got undefined. Input: "${input}"`,
				);
			}

			if (!expectedMention) {
				throw new Error(
					`Expected mention at index ${i} but got undefined. Input: "${input}"`,
				);
			}

			expect(actualMention.type).toBe(expectedMention.type);
			expect(actualMention.value).toBe(expectedMention.value);
			expect(actualMention.start).toBe(expectedMention.start);
			expect(actualMention.end).toBe(expectedMention.end);
		}
	});
});
