import { UnderlineLink } from '../underline-link';
import { useSearchContext } from './context';
import { EmptyState } from './empty';
import { RecentSearchesView } from './recent-searches';
import { ResultsView } from './results';

export function Dropdown() {
	const ctx = useSearchContext();

	return (
		<div className="my-2 rounded-md border border-border p-4">
			{ctx.showRecentSearches && <RecentSearchesView />}

			{ctx.showResults && <ResultsView />}

			{ctx.showAllResultsButton && (
				<UnderlineLink
					to="/search/$type"
					params={{
						type: ctx.searchType,
					}}
					search={{ q: ctx.autocomplete.currentRefinement }}
					className="ml-4"
				>
					See all results
				</UnderlineLink>
			)}

			{ctx.isEmpty && <EmptyState />}
		</div>
	);
}
