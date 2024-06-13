'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { useRefinementList } from 'react-instantsearch';

type Props = {
  attribute:
    | 'tags'
    | 'categoryId'
    | 'address.city'
    | 'priceLevel'
    | 'accessibilityLevel';
  className?: string;
  categories?: {
    id: number;
    name: string;
  }[];
};

export default function RefinementList({
  attribute,
  className,
  categories = [],
}: Props) {
  const {
    canToggleShowMore,
    items,
    isShowingMore,
    refine,
    searchForItems,
    toggleShowMore,
  } = useRefinementList({
    attribute: attribute,
    limit: attribute === 'categoryId' ? 10 : 5,
    operator: 'and',
    showMore: true,
    showMoreLimit: attribute === 'categoryId' ? 20 : 10,
    sortBy: ['isRefined', 'name:asc', 'count:desc'],
  });

  const title = useMemo(() => {
    switch (attribute) {
      case 'tags':
        return 'Tags';
      case 'categoryId':
        return 'Categories';
      case 'accessibilityLevel':
        return 'Accessibility Level';
      case 'priceLevel':
        return 'Price Level';
      case 'address.city':
        return 'Cities';
      default:
        return '';
    }
  }, [attribute]);

  const searchPlaceholder = useMemo(() => {
    switch (attribute) {
      case 'tags':
        return 'Search a tag';
      case 'address.city':
        return 'Search a city';
      default:
        return '';
    }
  }, [attribute]);

  const showInput = useMemo(() => {
    const searchable = ['tags', 'address.city'];
    return searchable.includes(attribute);
  }, [attribute]);

  const shouldRenderButton = useMemo(() => {
    const dontRenderButton = ['priceLevel', 'accessibilityLevel'];
    return !dontRenderButton.includes(attribute);
  }, [attribute]);

  const getCategoryName = (id: number) => {
    const res = categories.find((c) => c.id === id);
    return res ? res.name : '';
  };

  const getPriceLevelName = (label: string) => {
    switch (label) {
      case '1':
        return 'Cheap (1)';
      case '2':
        return 'Affordable (2)';
      case '3':
        return 'Moderate (3)';
      case '4':
        return 'Pricey (4)';
      case '5':
        return 'Expensive (5)';
      default:
        return '';
    }
  };

  const getAccessibilityLevelName = (label: string) => {
    switch (label) {
      case '1':
        return 'Not Accessible (1)';
      case '2':
        return 'Slightly Accessible (2)';
      case '3':
        return 'Moderately Accessible (3)';
      case '4':
        return 'Mostly Accessible (4)';
      case '5':
        return 'Highly Accessible (5)';
      default:
        return '';
    }
  };

  const getLabel = (label: string) => {
    if (attribute === 'categoryId') {
      return getCategoryName(+label);
    } else if (attribute === 'priceLevel') {
      return getPriceLevelName(label);
    } else if (attribute === 'accessibilityLevel') {
      return getAccessibilityLevelName(label);
    }

    return label;
  };

  return (
    <div className={cn('my-2', className)}>
      <div className="font-semibold tracking-tight">{title}</div>
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
        className={cn('space-y-2', {
          'mt-2': !showInput,
        })}
      >
        {items.map((item) => (
          <li key={item.label}>
            <label className="flex items-center">
              <Checkbox
                checked={item.isRefined}
                onCheckedChange={() => refine(item.value)}
              />
              <span className="ml-2 text-sm capitalize">
                {getLabel(item.label)}
              </span>
              <span className="ml-px text-sm text-muted-foreground">
                {' '}
                ({item.count})
              </span>
            </label>
          </li>
        ))}
      </ul>
      {shouldRenderButton && (
        <Button
          variant="link"
          onClick={toggleShowMore}
          disabled={!canToggleShowMore}
          className=" px-0"
        >
          {isShowingMore ? 'Show Less' : 'Show More'}
        </Button>
      )}
    </div>
  );
}
