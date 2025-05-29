import { InfoCard } from '@/components/kit/info-card';
import { cn } from '@/lib/utils';
import { getRouteApi, Link } from '@tanstack/react-router';
import { formatDate } from 'date-fns';
import { LeafIcon, Link2Icon, SpeechIcon } from 'lucide-react';

type Props = {
  className?: string;
};

export function InfoCardGroup({ className }: Props) {
  const rootRoute = getRouteApi('/u/$username');
  const { profile } = rootRoute.useLoaderData();
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    compactDisplay: 'short',
    notation: 'compact',
  });

  return (
    <div className={cn('grid grid-cols-2 gap-4', className)}>
      <Link
        to="/u/$username/followers"
        params={{ username: profile.username }}
      >
        <InfoCard.Root>
          <InfoCard.Content>
            <InfoCard.NumberColumn>
              {formatter.format(profile.followersCount)}
            </InfoCard.NumberColumn>
            <InfoCard.DescriptionColumn>
              <div className="flex items-center text-primary">Followers</div>
            </InfoCard.DescriptionColumn>
          </InfoCard.Content>
        </InfoCard.Root>
      </Link>

      <Link
        to="/u/$username/following"
        params={{ username: profile.username }}
      >
        <InfoCard.Root>
          <InfoCard.Content>
            <InfoCard.NumberColumn>
              {formatter.format(profile.followingCount)}
            </InfoCard.NumberColumn>
            <InfoCard.DescriptionColumn>
              <div className="flex items-center text-primary">Following</div>
            </InfoCard.DescriptionColumn>
          </InfoCard.Content>
        </InfoCard.Root>
      </Link>

      <InfoCard.Root>
        <InfoCard.Content>
          <InfoCard.NumberColumn>
            <LeafIcon className="text-primary size-16" />
          </InfoCard.NumberColumn>
          <InfoCard.DescriptionColumn>
            <div className="flex items-center text-primary">Joined</div>

            <span className="text-xs text-muted-foreground tracking-tight">
              {formatDate(profile.createdAt, 'PPP')}
            </span>
          </InfoCard.DescriptionColumn>
        </InfoCard.Content>
      </InfoCard.Root>

      {profile.pronouns && (
        <InfoCard.Root>
          <InfoCard.Content>
            <InfoCard.NumberColumn>
              <SpeechIcon className="text-primary size-16" />
            </InfoCard.NumberColumn>
            <InfoCard.DescriptionColumn>
              <div className="flex items-center text-primary">Pronouns</div>

              <span className="text-xs text-muted-foreground tracking-tight capitalize">
                {profile.pronouns}
              </span>
            </InfoCard.DescriptionColumn>
          </InfoCard.Content>
        </InfoCard.Root>
      )}

      {profile.website && (
        <InfoCard.Root>
          <InfoCard.Content>
            <InfoCard.NumberColumn>
              <Link2Icon className="text-primary size-16" />
            </InfoCard.NumberColumn>
            <InfoCard.DescriptionColumn>
              <div className="flex items-center text-primary">Website</div>

              <a
                className="text-xs text-muted-foreground tracking-tight"
                title={profile.website}
                href={profile.website}
                target="_blank"
                rel="noreferrer"
              >
                Go to website
              </a>
            </InfoCard.DescriptionColumn>
          </InfoCard.Content>
        </InfoCard.Root>
      )}
    </div>
  );
}
