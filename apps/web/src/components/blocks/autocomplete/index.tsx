import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
	type UseAutocompleteProps,
	useAutocomplete,
} from '@/hooks/use-autocomplete';
import { ipx } from '@/lib/ipx';
import { CustomSearchBox } from '../custom-search-box';
import { type AutocompleteItemInfo, Card } from './card';

type Props = {
	showAdvancedSearch?: boolean;
	showAllResultsButton?: boolean;
	isCardClickable?: boolean;
	onCardClick?: (v: AutocompleteItemInfo) => void;
} & UseAutocompleteProps;

export function Autocomplete({
	showAdvancedSearch = true,
	showAllResultsButton = true,
	isCardClickable = false,
	onCardClick,
	...props
}: Props) {
	const { indices, currentRefinement } = useAutocomplete(props);
	const hits = indices[0]?.hits ?? [];

	const showDropdown = currentRefinement !== '';
	const isEmptyResult = hits.length === 0;

	return (
		<div className="w-full">
			{showAdvancedSearch && (
				<div className="text-sm leading-none tracking-tight">
					Need more power? Try our{' '}
					<Button variant="link" className="px-0 underline" asChild>
						<Link to="/search">Advanced Search</Link>
					</Button>
				</div>
			)}

			<CustomSearchBox isSearchOnType />

			{showDropdown && (
				<div className="my-2 rounded-lg border border-border">
					{hits.slice(0, 5).map((hit) => (
						<Card
							key={hit.place.id}
							id={hit.place.id}
							image={ipx(hit.place.assets[0].url, 'w_512')}
							name={hit.place.name}
							categoryName={hit.place.category.name}
							city={hit.place.address.cityName}
							state={hit.place.address.city.stateName}
							isCardClickable={isCardClickable}
							onCardClick={onCardClick}
						/>
					))}

					{!isEmptyResult && showAllResultsButton && (
						<Button asChild variant="link">
							<Link
								to="/search"
								search={{
									q: currentRefinement,
								}}
							>
								See all results
							</Link>
						</Button>
					)}

					{isEmptyResult && (
						<Button asChild variant="link">
							<Link to="/search">
								No results found. Try our advanced search.
							</Link>
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
