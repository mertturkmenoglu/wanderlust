import { describe, expect, test } from 'vitest';
import { useLoadMoreText } from './use-load-more-text';

describe('Hooks/UseLoadMoreText', () => {
	test('fetching next page should be prioritized over has next page', () => {
		const input = {
			isFetchingNextPage: true,
			hasNextPage: true,
		};

		const expected = 'Loading more...';
		const actual = useLoadMoreText(input);

		expect(actual).toBe(expected);
	});

	test('when has next page is true and not fetching next page, should return "Load More"', () => {
		const input = {
			isFetchingNextPage: false,
			hasNextPage: true,
		};

		const expected = 'Load More';
		const actual = useLoadMoreText(input);

		expect(actual).toBe(expected);
	});

	test('when has next page is false and not fetching next page, should return "Nothing more to load"', () => {
		const input = {
			isFetchingNextPage: false,
			hasNextPage: false,
		};

		const expected = 'Nothing more to load';
		const actual = useLoadMoreText(input);

		expect(actual).toBe(expected);
	});
});
