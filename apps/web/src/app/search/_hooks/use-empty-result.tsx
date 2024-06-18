import { useSearchParams } from 'next/navigation';
import { useHits } from 'react-instantsearch';

export function useEmptyResult() {
  const { results } = useHits();
  const searchParams = useSearchParams();

  const isEmptyResult = results?.nbHits ? results.nbHits === 0 : true;
  const isEmptyQuery = searchParams.size === 0;

  return { isEmptyResult, isEmptyQuery };
}
