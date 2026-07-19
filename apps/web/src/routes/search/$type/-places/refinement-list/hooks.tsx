import { useRefinementList as _useRefinementList } from 'react-instantsearch';
import { useCategoriesQuery } from '@/hooks/use-categories';
import { amenitiesDisplayNames } from '@/lib/amenities';
import { toTitleCase } from '@/lib/text';
import { useRefinementListContext } from './context';
import type { RefinementListAttribute, RefinementListItemProps } from './types';

export function useRefinementTitle(attribute: RefinementListAttribute) {
	switch (attribute) {
		case 'place.primaryCategory.id':
			return 'Categories';
		case 'place.priceLevel':
			return 'Price Level';
		case 'place.accessibilityLevel':
			return 'Accessibility Level';
		case 'place.city.stateName':
			return 'States';
		case 'place.city.name':
			return 'Cities';
		case 'place.amenities':
			return 'Amenities';
		case 'place.city.countryName':
			return 'Countries';
		case 'place.accolades.title':
			return 'Accolades';
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
		case 'place.primaryCategory.id':
			return 10;
		case 'place.accolades.title':
			return 10;
		default:
			return 5;
	}
}

export function useShowMoreLimit(attribute: RefinementListAttribute) {
	switch (attribute) {
		case 'place.primaryCategory.id':
			return 20;
		case 'place.accolades.title':
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
		case 'place.primaryCategory.id':
			return 'Search categories';
		case 'place.city.name':
			return 'Search cities';
		case 'place.city.countryName':
			return 'Search countries';
		default:
			return `Search ${attribute}`;
	}
}

export function useShowInput(attribute: RefinementListAttribute) {
	const searchable: RefinementListAttribute[] = [
		'place.primaryCategory.id',
		'place.city.name',
		'place.city.countryName',
	];
	return searchable.includes(attribute);
}

export function useItemLabel(item: RefinementListItemProps['item']) {
	const ctx = useRefinementListContext();
	const query = useCategoriesQuery();
	const categories = query.data?.categories ?? [];

	switch (ctx.attribute) {
		case 'place.priceLevel':
			return toTitleCase(item.value.replace('_', ' '));
		case 'place.accessibilityLevel':
			return toTitleCase(item.value.replace('_', ' '));
		case 'place.amenities':
			return amenitiesDisplayNames.get(item.value) ?? item.value;
		case 'place.primaryCategory.id': {
			const category = categories.find((c) => c.id === item.value);
			return category?.displayName ?? item.value;
		}
		default:
			return item.label;
	}
}
