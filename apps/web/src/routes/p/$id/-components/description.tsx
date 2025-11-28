import { CollapsibleText } from '@/components/blocks/collapsible-text';
import { FormattedRating } from '@/components/kit/formatted-rating';
import { InfoCard } from '@/components/kit/info-card';
import { computeRating } from '@/lib/rating';
import { cn } from '@/lib/utils';
import { getRouteApi } from '@tanstack/react-router';
import { DollarSignIcon, HeartIcon, PersonStandingIcon } from 'lucide-react';
import { PlanTripDialog } from './plan-trip-dialog';

type Props = {
  className?: string;
};

export function Description({ className }: Props) {
  const route = getRouteApi('/p/$id/');
  const { place } = route.useLoaderData();
  const rating = computeRating(place.totalPoints, place.totalVotes);
  const fmt = Intl.NumberFormat('en-US', {
    style: 'decimal',
    compactDisplay: 'short',
    notation: 'compact',
  });

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4', className)}>
      <div className="flex flex-col">
        <h3 className="text-xl font-semibold">Description</h3>
        <CollapsibleText
          text={place.description}
          charLimit={1000}
        />

        <PlanTripDialog />
      </div>

      <div className="grid grid-cols-2 grid-rows-2 gap-2 h-min">
        <InfoCard.Root>
          <InfoCard.Content>
            <InfoCard.NumberColumn>
              {computeRating(place.totalPoints, place.totalVotes)}
            </InfoCard.NumberColumn>
            <InfoCard.DescriptionColumn>
              <FormattedRating
                rating={Number.parseFloat(rating)}
                votes={place.totalVotes}
                showNumbers={false}
              />
              <span className="text-xs text-muted-foreground tracking-tight">
                {fmt.format(place.totalVotes)} reviews
              </span>
            </InfoCard.DescriptionColumn>
          </InfoCard.Content>
        </InfoCard.Root>

        <InfoCard.Root>
          <InfoCard.Content>
            <InfoCard.NumberColumn>
              {fmt.format(place.totalFavorites)}
            </InfoCard.NumberColumn>
            <InfoCard.DescriptionColumn>
              <div className="flex items-center gap-1">
                <HeartIcon className="fill-primary text-primary size-4" />
                <HeartIcon className="fill-primary text-primary size-4" />
                <HeartIcon className="fill-primary text-primary size-4" />
              </div>
              <span className="text-xs text-muted-foreground tracking-tight">
                Favorites
              </span>
            </InfoCard.DescriptionColumn>
          </InfoCard.Content>
        </InfoCard.Root>

        <InfoCard.Root>
          <InfoCard.Content>
            <InfoCard.NumberColumn>{place.priceLevel}/5</InfoCard.NumberColumn>
            <InfoCard.DescriptionColumn>
              <div className="flex items-center">
                {Array.from({ length: place.priceLevel }).map((_, i) => (
                  <DollarSignIcon
                    className="text-primary size-4"
                    key={i}
                  />
                ))}
              </div>

              <span className="text-xs text-muted-foreground tracking-tight">
                Price Level
              </span>
            </InfoCard.DescriptionColumn>
          </InfoCard.Content>
        </InfoCard.Root>

        <InfoCard.Root>
          <InfoCard.Content>
            <InfoCard.NumberColumn>
              {place.accessibilityLevel}/5
            </InfoCard.NumberColumn>
            <InfoCard.DescriptionColumn>
              <div className="flex items-center">
                {Array.from({ length: place.accessibilityLevel }).map(
                  (_, i) => (
                    <PersonStandingIcon
                      className="text-primary size-4"
                      key={i}
                    />
                  ),
                )}
              </div>

              <span className="text-xs text-muted-foreground tracking-tight">
                Accessibility{' '}
                <span className="sr-only md:not-sr-only">Level</span>
              </span>
            </InfoCard.DescriptionColumn>
          </InfoCard.Content>
        </InfoCard.Root>
      </div>
    </div>
  );
}
