import { useQuery } from "@tanstack/react-query";
import { HeartIcon, LoaderCircleIcon, PenIcon, UsersIcon } from "lucide-react";
import { Link } from "react-router";
import invariant from "tiny-invariant";
import AppMessage from "~/components/blocks/app-message";
import { getUserActivities } from "~/lib/api-requests";
import type { Activity } from "~/lib/dto";
import { Route } from "./+types/route";

export async function loader({ params }: Route.LoaderArgs) {
  invariant(params.username, "username is required");
  return { username: params.username };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { username } = loaderData;

  const query = useQuery({
    queryKey: ["user-activities", username],
    queryFn: async () => getUserActivities(username),
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
    const activities = query.data.data.activities;

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
          <ActivityCard activity={act} key={`activity-${i}`} />
        ))}
      </div>
    );
  }

  return (
    <LoaderCircleIcon className="my-16 mx-auto size-8 text-primary animate-spin" />
  );
}

type Props = {
  activity: Activity;
};

function ActivityCard({ activity: { type, payload } }: Props) {
  if (type === "activity-favorite") {
    return (
      <div className="flex items-center gap-2">
        <HeartIcon className="text-primary size-4" />
        <div>
          Added{" "}
          <Link to={`/p/${payload.poiId}`} className="text-primary">
            {payload.poiName}
          </Link>{" "}
          to favorites.
        </div>
      </div>
    );
  }

  if (type === "activity-follow") {
    return (
      <div className="flex items-center gap-2">
        <UsersIcon className="text-primary size-4" />
        <div>
          Followed{" "}
          <Link to={`/u/${payload.otherUsername}`} className="text-primary">
            @{payload.otherUsername}
          </Link>
          .
        </div>
      </div>
    );
  }

  if (type === "activity-review") {
    return (
      <div className="flex items-center gap-2">
        <PenIcon className="text-primary size-4" />
        <div>
          Reviewed{" "}
          <Link to={`/p/${payload.poiId}`} className="text-primary">
            {payload.poiName}
          </Link>
          <span className="ml-2">{payload.rating} stars</span>
        </div>
      </div>
    );
  }

  return <div></div>;
}
