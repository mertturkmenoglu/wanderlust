import type { RefinementListItem } from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList';

export type RefinementListProps = {
	attribute:
		| 'place.primaryCategory.id'
		| 'place.priceLevel'
		| 'place.accessibilityLevel'
		| 'place.city.stateName'
		| 'place.city.name'
		| 'place.amenities'
		| 'place.city.countryName'
		| 'place.accolades.title';
	className?: string;
};

export type RefinementListAttribute = RefinementListProps['attribute'];

export type RefinementListItemProps = {
	item: RefinementListItem;
	className?: string;
};
