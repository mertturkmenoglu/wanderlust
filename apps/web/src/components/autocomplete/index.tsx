import { Link } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import {
	type UseAutocompleteProps,
	useAutocomplete,
} from '@/hooks/use-autocomplete';
import type { TSearchHit } from '@/lib/search';
import { CustomSearchBox } from '../custom-search-box';
import { Card } from './card';

type Props = {
	showAdvancedSearch?: boolean;
	showAllResultsButton?: boolean;
	isCardClickable?: boolean;
	onCardClick?: (v: TSearchHit['place']) => void;
} & UseAutocompleteProps;

export function Autocomplete({
	showAdvancedSearch = true,
	showAllResultsButton = true,
	isCardClickable = false,
	onCardClick,
	...props
}: Props) {
	const { indices, currentRefinement } = useAutocomplete(props);
	const hits = (indices[0]?.hits ?? []) as unknown as TSearchHit[];

	const showDropdown = currentRefinement !== '';
	const isEmptyResult = hits.length === 0;

	return (
		<div className="w-full">
			{showAdvancedSearch && (
				<div className="text-sm leading-none tracking-tight">
					Need more power? Try our{' '}
					<Link
						to="/search"
						className={buttonVariants({
							variant: 'link',
							className: 'px-0! underline',
						})}
					>
						Advanced Search
					</Link>
				</div>
			)}

			<CustomSearchBox isSearchOnType />

			{showDropdown && (
				<div className="my-2 rounded-lg border border-border">
					{hits.slice(0, 5).map((hit) => (
						<Card
							key={hit.place.id}
							place={hit.place}
							isCardClickable={isCardClickable}
							onCardClick={onCardClick}
						/>
					))}

					{!isEmptyResult && showAllResultsButton && (
						<Link
							to="/search"
							search={{
								q: currentRefinement,
							}}
							className={buttonVariants({ variant: 'link' })}
						>
							See all results
						</Link>
					)}

					{isEmptyResult && (
						<Link to="/search" className={buttonVariants({ variant: 'link' })}>
							No results found. Try our advanced search.
						</Link>
					)}
				</div>
			)}
		</div>
	);
}
