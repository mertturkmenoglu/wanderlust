import { Link } from '@tanstack/react-router';
import { HeartIcon, PenIcon, UsersIcon } from 'lucide-react';

type UserActivityType =
  | 'activity-favorite'
  | 'activity-follow'
  | 'activity-review';

type Activity = {
  type: UserActivityType;
  // oxlint-disable-next-line no-explicit-any
  payload: Record<string, any>;
};

type Props = {
  activity: Activity;
};

function ActivityCard({ activity: { type, payload } }: Props) {
  if (type === 'activity-favorite') {
    return (
      <div className="flex items-center gap-2">
        <HeartIcon className="text-primary size-4" />
        <div>
          Added{' '}
          <Link
            to="/p/$id"
            params={{
              id: payload.poiId,
            }}
            className="text-primary"
          >
            {payload.poiName}
          </Link>{' '}
          to favorites.
        </div>
      </div>
    );
  }

  if (type === 'activity-follow') {
    return (
      <div className="flex items-center gap-2">
        <UsersIcon className="text-primary size-4" />
        <div>
          Followed{' '}
          <Link
            to="/u/$username"
            params={{ username: payload.otherUsername }}
            className="text-primary"
          >
            @{payload.otherUsername}
          </Link>
          .
        </div>
      </div>
    );
  }

  if (type === 'activity-review') {
    return (
      <div className="flex items-center gap-2">
        <PenIcon className="text-primary size-4" />
        <div>
          Reviewed{' '}
          <Link
            to="/p/$id"
            params={{ id: payload.poiId }}
            className="text-primary"
          >
            {payload.poiName}
          </Link>
          <span className="ml-2">{payload.rating} stars</span>
        </div>
      </div>
    );
  }

  return <div />;
}

export { ActivityCard, type Activity, type UserActivityType };
