import { AppMessage } from '@/components/blocks/app-message';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircleIcon } from 'lucide-react';
import { ActivityCard, type UserActivityType } from './-activity-card';

export const Route = createFileRoute('/u/$username/activities/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { username } = Route.useParams();
  const query = api.useQuery('get', '/api/v2/users/{username}/activities', {
    params: {
      path: {
        username,
      },
    },
  });

  if (query.error) {
    return (
      <AppMessage
        errorMessage="Something went wrong"
        className="my-16"
        showBackButton={false}
      />
    );
  }

  if (query.data) {
    const activities = query.data.activities;

    if (activities.length === 0) {
      return (
        <AppMessage
          emptyMessage="No activities"
          showBackButton={false}
          className="my-16"
        />
      );
    }

    return (
      <div className="space-y-4">
        {activities.map((act, i) => (
          <ActivityCard
            activity={{
              type: act.type as unknown as UserActivityType,
              payload: act.payload as unknown as Record<string, unknown>,
            }}
            key={`activity-${i}`}
          />
        ))}
      </div>
    );
  }

  return (
    <LoaderCircleIcon className="my-16 mx-auto size-8 text-primary animate-spin" />
  );
}
