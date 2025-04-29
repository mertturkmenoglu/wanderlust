export function computeRating(points: number, votes: number): string {
  if (votes === 0) {
    return Number.parseFloat("0").toFixed(1);
  }

  return (points / votes).toFixed(1);
}
