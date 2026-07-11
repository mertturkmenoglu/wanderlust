const fmt = new Intl.NumberFormat('en-US', {
	style: 'decimal',
	compactDisplay: 'short',
	notation: 'compact',
});

export function useNumberFormatter() {
	return fmt;
}
