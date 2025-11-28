// oxlint-disable func-style
/** biome-ignore-all lint/a11y/noLabelWithoutControl: TODO */

import type { RefinementListItem } from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList';
import { useMemo } from 'react';
import { useRefinementList } from 'react-instantsearch';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Props = {
	attribute:
		| 'poi.category.name'
		| 'poi.priceLevel'
		| 'poi.accessibilityLevel'
		| 'poi.address.city.state.name'
		| 'poi.address.city.name'
		| 'poi.amenities.name'
		| 'poi.address.city.country.name';
	className?: string;
};

type Attribute = Props['attribute'];

function getPriceLevelLabel(x: number): string {
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

function getAccessibilityLevelLabel(x: number): string {
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

export function RefinementList({ attribute, className }: Props) {
	const limit = attribute === 'poi.category.name' ? 10 : 5;
	const showMoreLimit = attribute === 'poi.category.name' ? 20 : 10;

	const {
		canToggleShowMore,
		items,
		isShowingMore,
		refine,
		searchForItems,
		toggleShowMore,
	} = useRefinementList({
		attribute,
		limit,
		operator: 'or',
		showMore: true,
		showMoreLimit,
		sortBy: ['isRefined', 'name:asc', 'count:desc'],
	});

	const title = useMemo(() => {
		switch (attribute) {
			case 'poi.category.name':
				return 'Categories';
			case 'poi.priceLevel':
				return 'Price Level';
			case 'poi.accessibilityLevel':
				return 'Accessibility Level';
			case 'poi.address.city.state.name':
				return 'States';
			case 'poi.address.city.name':
				return 'Cities';
			case 'poi.amenities.name':
				return 'Amenities';
			case 'poi.address.city.country.name':
				return 'Countries';
			default:
				return attribute;
		}
	}, [attribute]);

	const searchPlaceholder = useMemo(() => {
		switch (attribute) {
			case 'poi.category.name':
				return 'Search a category';
			default:
				return attribute;
		}
	}, [attribute]);

	const showInput = useMemo(() => {
		const searchable: Attribute[] = ['poi.category.name'];
		return searchable.includes(attribute);
	}, [attribute]);

	const shouldRenderButton = useMemo(() => {
		const dontRenderButton: Attribute[] = [
			'poi.priceLevel',
			'poi.accessibilityLevel',
		];
		return !dontRenderButton.includes(attribute);
	}, [attribute]);

	const getLabel = (item: RefinementListItem) => {
		switch (attribute) {
			case 'poi.priceLevel':
				return getPriceLevelLabel(+item.value);
			case 'poi.accessibilityLevel':
				return getAccessibilityLevelLabel(+item.value);
			default:
				return item.label;
		}
	};

	return (
		<div className={cn('my-2 flex flex-col items-start', className)}>
			<div className="text-left font-semibold tracking-tight">{title}</div>
			{showInput && (
				<Input
					type="search"
					autoComplete="off"
					autoCorrect="off"
					autoCapitalize="off"
					spellCheck={false}
					maxLength={512}
					className="my-4"
					onChange={(event) => searchForItems(event.currentTarget.value)}
					placeholder={searchPlaceholder}
				/>
			)}
			<ul
				className={cn('w-full space-y-2', {
					'mt-2': !showInput,
				})}
			>
				{items.map((item) => (
					<li key={item.label} className="w-full">
						<label className="flex w-full items-center">
							<Checkbox
								checked={item.isRefined}
								onCheckedChange={() => refine(item.value)}
							/>
							<span className="ml-2 line-clamp-1 w-full text-left text-sm capitalize">
								{getLabel(item)}
							</span>
							<span className="ml-px text-muted-foreground text-sm">
								{' '}
								({item.count})
							</span>
						</label>
					</li>
				))}
			</ul>
			{shouldRenderButton && items.length >= limit && (
				<Button
					variant="link"
					onClick={toggleShowMore}
					disabled={!canToggleShowMore}
					className="px-0"
				>
					{isShowingMore ? 'Show Less' : 'Show More'}
				</Button>
			)}
		</div>
	);
}
