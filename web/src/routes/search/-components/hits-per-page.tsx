import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCallback } from 'react';
import { useHitsPerPage } from 'react-instantsearch';

export default function HitsPerPage() {
  const { items, refine } = useHitsPerPage({
    items: [
      { label: '10 items', value: 10, default: true },
      { label: '25 items', value: 25 },
      { label: '50 items', value: 50 },
    ],
  });

  const { value: currentValue } =
    items.find(({ isRefined }) => isRefined) || {};

  const onValueChange = useCallback(
    (v: string) => {
      refine(+v);
    },
    [refine]
  );

  return (
    <Select
      onValueChange={onValueChange}
      value={String(currentValue)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Items per page" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Items per page</SelectLabel>
          {items.map((item) => (
            <SelectItem
              key={item.value}
              value={String(item.value)}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}