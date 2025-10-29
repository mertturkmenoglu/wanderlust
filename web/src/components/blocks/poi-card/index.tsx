import { cn } from '@/lib/utils';
import type { Props } from './types';
import { PoiCardContextProvider, usePoiCardContext } from './context';
import { NavigationButton } from './navigation-button';
import { DotNavigation } from './dot-navigation';
import { Info } from './info';
import { Images } from './images';

export function PoiCard(props: Props) {
  return (
    <PoiCardContextProvider poi={props.poi}>
      <Content {...props} />
    </PoiCardContextProvider>
  );
}

function Content({ className, hoverEffects = true, ...props }: Props) {
  const ctx = usePoiCardContext();

  return (
    <div
      key={ctx.poi.id}
      className={cn(
        'group transition duration-300 ease-in-out rounded-md',
        {
          'hover:bg-gray-100 hover:-m-2 hover:p-2': hoverEffects,
        },
        className,
      )}
      {...props}
    >
      <div className="relative">
        <NavigationButton type="previous" />

        <Images />

        <NavigationButton type="next" />

        <DotNavigation />
      </div>

      <Info />
    </div>
  );
}
