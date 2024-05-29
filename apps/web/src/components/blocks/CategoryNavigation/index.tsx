import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import data from './data';
import NavItem from './item';

function CategoryNavigation(): React.ReactElement {
  return (
    <ScrollArea>
      <ul className="my-4 flex items-center justify-center space-x-4">
        {data.map((item) => (
          <NavItem
            {...item}
            key={item.href}
          />
        ))}
      </ul>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export default CategoryNavigation;
