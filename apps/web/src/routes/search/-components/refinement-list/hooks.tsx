import { useRefinementList as _useRefinementList } from 'react-instantsearch';
import { amenitiesDisplayNames } from '@/lib/amenities';
import { useRefinementListContext } from './context';
import type { RefinementListAttribute, RefinementListItemProps } from './types';

export function useRefinementTitle(attribute: RefinementListAttribute) {
	switch (attribute) {
		case 'place.category.name':
			return 'Categories';
		case 'place.priceLevel':
			return 'Price Level';
		case 'place.accessibilityLevel':
			return 'Accessibility Level';
		case 'place.address.city.stateName':
			return 'States';
		case 'place.address.city.name':
			return 'Cities';
		case 'place.amenities':
			return 'Amenities';
		case 'place.address.city.countryName':
			return 'Countries';
		default:
			return attribute;
	}
}

export function getPriceLevelLabel(x: number): string {
	switch (x) {
		case 1:
			return '1 - Budget-Friendly';
		case 2:
			return '2 - Affordable';
		case 3:
			return '3 - Moderate';
		case 4:
			return '4 - Pricey';
		case 5:
			return '5 - Luxury';
		default:
			return 'Unknown';
	}
}

export function getAccessibilityLevelLabel(x: number): string {
	switch (x) {
		case 1:
			return '1 - Not Accessible';
		case 2:
			return '2 - Partially Accessible';
		case 3:
			return '3 - Moderately Accessible';
		case 4:
			return '4 - Mostly Accessible';
		case 5:
			return '5 - Fully Accessible';
		default:
			return 'Unknown';
	}
}

export function useShouldRenderMoreButton(attribute: RefinementListAttribute) {
	const dontRenderButton: RefinementListAttribute[] = [
		'place.priceLevel',
		'place.accessibilityLevel',
	];
	return !dontRenderButton.includes(attribute);
}

export function useLimit(attribute: RefinementListAttribute) {
	switch (attribute) {
		case 'place.category.name':
			return 10;
		default:
			return 5;
	}
}

export function useShowMoreLimit(attribute: RefinementListAttribute) {
	switch (attribute) {
		case 'place.category.name':
			return 20;
		default:
			return 10;
	}
}

export function useRefinementList(attribute: RefinementListAttribute) {
	const limit = useLimit(attribute);
	const showMoreLimit = useShowMoreLimit(attribute);

	return _useRefinementList({
		attribute,
		limit,
		operator: 'or',
		showMore: true,
		showMoreLimit,
		sortBy: ['isRefined', 'name:asc', 'count:desc'],
	});
}

export function useSearchPlaceholder(attribute: RefinementListAttribute) {
	switch (attribute) {
		case 'place.category.name':
			return 'Search categories';
		default:
			return `Search ${attribute}`;
	}
}

export function useShowInput(attribute: RefinementListAttribute) {
	const searchable: RefinementListAttribute[] = ['place.category.name'];
	return searchable.includes(attribute);
}

export function useItemLabel(item: RefinementListItemProps['item']) {
	const ctx = useRefinementListContext();

	switch (ctx.attribute) {
		case 'place.priceLevel':
			return getPriceLevelLabel(+item.value);
		case 'place.accessibilityLevel':
			return getAccessibilityLevelLabel(+item.value);
		case 'place.amenities':
			return amenitiesDisplayNames.get(item.value) ?? item.value;
		default:
			return item.label;
	}
}
