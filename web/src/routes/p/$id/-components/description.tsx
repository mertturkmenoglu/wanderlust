import CollapsibleText from '@/components/blocks/collapsible-text';
import FormattedRating from '@/components/kit/formatted-rating';
import { Button } from '@/components/ui/button';
import { computeRating } from '@/lib/rating';
import { cn } from '@/lib/utils';
import { getRouteApi } from '@tanstack/react-router';
import {
  DollarSignIcon,
  HeartIcon,
  MapIcon,
  PersonStandingIcon,
} from 'lucide-react';
import { InfoCard } from './info-card';

type Props = {
  className?: string;
};

export function Description({ className }: Props) {
  const route = getRouteApi('/p/$id/');
  const { poi } = route.useLoaderData();
  const rating = computeRating(poi.totalPoints, poi.totalVotes);
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
          text={poi.description}
          charLimit={1000}
        />
        <Button
          size="lg"
          className="mt-4 w-2/3 mx-auto"
        >
          <MapIcon className="size-5" />
          <span className="text-base">Plan a trip</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 grid-rows-2 gap-2">
        <InfoCard.Root>
          <InfoCard.Content>
            <InfoCard.NumberColumn>
              {computeRating(poi.totalPoints, poi.totalVotes)}
            </InfoCard.NumberColumn>
            <InfoCard.DescriptionColumn>
              <FormattedRating
                rating={parseFloat(rating)}
                votes={poi.totalVotes}
                showNumbers={false}
              />
              <span className="text-xs text-muted-foreground tracking-tight">
                {fmt.format(poi.totalVotes)} reviews
              </span>
            </InfoCard.DescriptionColumn>
          </InfoCard.Content>
        </InfoCard.Root>

        <InfoCard.Root>
          <InfoCard.Content>
            <InfoCard.NumberColumn>
              {fmt.format(poi.totalFavorites)}
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
            <InfoCard.NumberColumn>{poi.priceLevel}/5</InfoCard.NumberColumn>
            <InfoCard.DescriptionColumn>
              <div className="flex items-center">
                {Array.from({ length: poi.priceLevel }).map((_, i) => (
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
              {poi.accessibilityLevel}/5
            </InfoCard.NumberColumn>
            <InfoCard.DescriptionColumn>
              <div className="flex items-center">
                {Array.from({ length: poi.accessibilityLevel }).map((_, i) => (
                  <PersonStandingIcon
                    className="text-primary size-4"
                    key={i}
                  />
                ))}
              </div>

              <span className="text-xs text-muted-foreground tracking-tight">
                Accessibility Level
              </span>
            </InfoCard.DescriptionColumn>
          </InfoCard.Content>
        </InfoCard.Root>
      </div>
    </div>
  );
}
