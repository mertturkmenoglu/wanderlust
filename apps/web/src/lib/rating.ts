export function computeRating(points: number, votes: number): string {
	if (points < 0) {
		throw new Error('Points cannot be negative');
	}

	if (votes < 0) {
		throw new Error('Votes cannot be negative');
	}

	if (votes === 0) {
		return Number.parseFloat('0').toFixed(1);
	}

	return (points / votes).toFixed(1);
}
