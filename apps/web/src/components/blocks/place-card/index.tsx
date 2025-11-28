import { cn } from '@/lib/utils';
import { PlaceCardContextProvider, usePlaceCardContext } from './context';
import { DotNavigation } from './dot-navigation';
import { Images } from './images';
import { Info } from './info';
import { NavigationButton } from './navigation-button';
import type { Props } from './types';

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
				'group rounded-md transition duration-300 ease-in-out',
				{
					'hover:-m-2 hover:bg-gray-100 hover:p-2': hoverEffects,
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
