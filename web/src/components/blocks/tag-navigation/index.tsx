import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import data from './data';
import NavItem from './item';

type Props = {
  urlSuffix?: string;
};

export default function TagNavigation({ urlSuffix = '' }: Props) {
  return (
    <ScrollArea>
      <ul className="flex items-center justify-center space-x-4">
        {data.map((item) => (
          <NavItem
            {...item}
            href={item.href + urlSuffix}
            key={item.href}
          />
        ))}
      </ul>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
