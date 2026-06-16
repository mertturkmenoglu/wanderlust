export function useNumberFormatter() {
	return new Intl.NumberFormat('en-US', {
		style: 'decimal',
		compactDisplay: 'short',
		notation: 'compact',
	});
}
