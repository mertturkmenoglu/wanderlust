import { useAutocomplete } from '@/hooks/useAutocomplete';
import { useHits } from 'react-instantsearch';

export function useEmptyResult() {
  const { results } = useHits();
  const { currentRefinement } = useAutocomplete();

  const isEmptyResult = results?.nbHits ? results.nbHits === 0 : true;
  const isEmptyQuery = currentRefinement === '';

  return { isEmptyResult, isEmptyQuery };
}
