import type { RefinementListItem } from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList';

export type RefinementListProps = {
	attribute:
	| 'place.category.name'
	| 'place.priceLevel'
	| 'place.accessibilityLevel'
	| 'place.address.city.stateName'
	| 'place.address.city.name'
	| 'place.amenities'
	| 'place.address.city.countryName'
	| 'place.accolades.accolade.title'
	className?: string;
};

export type RefinementListAttribute = RefinementListProps['attribute'];

export type RefinementListItemProps = {
	item: RefinementListItem;
	className?: string;
};
