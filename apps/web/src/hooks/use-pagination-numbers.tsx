export function usePaginationNumbers(current: number, total: number): number[] {
  const allNums = [
    current - 4,
    current - 3,
    current - 2,
    current - 1,
    current,
    current + 1,
    current + 2,
    current + 3,
    current + 4,
  ].filter((x) => !(x < 1 || x > total));

  if (allNums.some((x) => x === 1)) {
    return allNums.slice(0, Math.min(5, total));
  }

  if (allNums.some((x) => x === total)) {
    return allNums.slice(-5);
  }

  // oxlint-disable-next-line prefer-negative-index
  return allNums.slice(2, allNums.length - 1);
}
