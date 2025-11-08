import { cn } from '@/lib/utils';
import type { Props } from './types';
import { PlaceCardContextProvider, usePlaceCardContext } from './context';
import { NavigationButton } from './navigation-button';
import { DotNavigation } from './dot-navigation';
import { Info } from './info';
import { Images } from './images';

export function PlaceCard(props: Props) {
  return (
    <PlaceCardContextProvider place={props.place}>
      <Content {...props} />
    </PlaceCardContextProvider>
  );
}

function Content({ className, hoverEffects = true, ...props }: Props) {
  const ctx = usePlaceCardContext();

  return (
    <div
      key={ctx.place.id}
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
