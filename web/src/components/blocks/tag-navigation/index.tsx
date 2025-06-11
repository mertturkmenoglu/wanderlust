import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { data } from './data';
import { NavItem } from './item';

type Props = {
  urlSuffix?: string;
};

export function TagNavigation({ urlSuffix = '' }: Props) {
  return (
    <ScrollArea>
      <ul className="flex items-center justify-center space-x-4">
        {data.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            href={item.href + urlSuffix}
          />
        ))}
      </ul>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
