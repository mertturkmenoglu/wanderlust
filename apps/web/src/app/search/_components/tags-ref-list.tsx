'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useRefinementList } from 'react-instantsearch';

export default function TagsRefinementList() {
  const {
    canToggleShowMore,
    items,
    isShowingMore,
    refine,
    searchForItems,
    toggleShowMore,
  } = useRefinementList({
    attribute: 'tags',
    limit: 5,
    operator: 'and',
    showMore: true,
    showMoreLimit: 10,
    sortBy: ['isRefined', 'name:asc', 'count:desc'],
  });

  return (
    <div className="my-2">
      <div className="font-semibold tracking-tight">Tags</div>
      <Input
        type="search"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        maxLength={512}
        className="my-4"
        onChange={(event) => searchForItems(event.currentTarget.value)}
        placeholder="Search a tag"
      />
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.label}>
            <label className="flex items-center">
              <Checkbox
                checked={item.isRefined}
                onCheckedChange={() => refine(item.value)}
              />
              <span className="ml-2 text-sm capitalize">{item.label}</span>
              <span className="ml-px text-sm text-muted-foreground">
                {' '}
                ({item.count})
              </span>
            </label>
          </li>
        ))}
      </ul>
      <Button
        variant="link"
        onClick={toggleShowMore}
        disabled={!canToggleShowMore}
        className=" px-0"
      >
        {isShowingMore ? 'Show Less' : 'Show More'}
      </Button>
    </div>
  );
}
