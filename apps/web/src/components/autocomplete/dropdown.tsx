import { UnderlineLink } from '../underline-link';
import { Card } from './card';
import { useAutocompleteContext } from './context';
import { EmptyState } from './empty';
import { RecentSearchesView } from './recent-searches';

export function Dropdown() {
	const ctx = useAutocompleteContext();

	return (
		<div className="my-2 rounded-lg border border-border p-4">
			{ctx.showRecentSearches && <RecentSearchesView />}

			{ctx.showResults && (
				<div>
					{ctx.hits.slice(0, 5).map((hit, index) => (
						<Card
							key={`search-result-${hit.place.id}-${index}`}
							place={hit.place}
							isCardClickable={ctx.isCardClickable}
							onCardClick={ctx.onCardClick}
						/>
					))}
				</div>
			)}

			{ctx.showAllResultsButton && (
				<UnderlineLink
					to="/search"
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
