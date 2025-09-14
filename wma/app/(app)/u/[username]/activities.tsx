import { api } from "@/api/api";
import { Link, useLocalSearchParams } from "expo-router";
import { Suspense } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { HeartIcon, PenIcon, UsersIcon } from "lucide-react-native";

export default function Page() {
  return (
    <Suspense fallback={<ActivityIndicator />}>
      <Content />
    </Suspense>
  );
}

function Content() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const query = api.useSuspenseQuery(
    "get",
    "/api/v2/users/{username}/activities",
    {
      params: {
        path: {
          username,
        },
      },
    }
  );

  const activities = query.data.activities;

  return (
    <View className="mt-4">
      {activities.map((act, i) => (
        <ActivityCard
          key={JSON.stringify(act) + `${i}`}
          activity={{
            type: act.type as unknown as UserActivityType,
            payload: act.payload as unknown as Record<string, unknown>,
          }}
        />
      ))}
      {activities.length === 0 ? <Text>No activities</Text> : null}
    </View>
  );
}

type UserActivityType =
  | "activity-favorite"
  | "activity-follow"
  | "activity-review";

type Activity = {
  type: UserActivityType;
  // oxlint-disable-next-line no-explicit-any
  payload: Record<string, any>;
};

type Props = {
  activity: Activity;
};

function ActivityCard({ activity: { type, payload } }: Props) {
  if (type === "activity-favorite") {
    return (
      <View className="flex flex-row items-center gap-2 mt-2">
        <HeartIcon size={24} color={Colors.light.primary} />
        <Text>
          Added{" "}
          <Link
            href={{
              pathname: "/p/[id]",
              params: {
                id: payload.poiId,
              },
            }}
            className="text-primary"
          >
            {payload.poiName}
          </Link>{" "}
          to favorites.
        </Text>
      </View>
    );
  }

  if (type === "activity-follow") {
    return (
      <View className="flex flex-row items-center gap-2 mt-2">
        <UsersIcon size={24} color={Colors.light.primary} />
        <Text>
          Followed{" "}
          <Link
            href={{
              pathname: "/u/[username]",
              params: {
                username: payload.otherUsername,
              },
            }}
            className="text-primary"
          >
            @{payload.otherUsername}
          </Link>
          .
        </Text>
      </View>
    );
  }

  if (type === "activity-review") {
    return (
      <View className="flex flex-row items-center mt-2">
        <PenIcon size={24} color={Colors.light.primary} />
        <Text className="ml-2">
          Reviewed{" "}
          <Link
            href={{
              pathname: "/p/[id]",
              params: {
                id: payload.poiId,
              },
            }}
            className="text-primary"
          >
            {payload.poiName}
          </Link>
        </Text>
        <Text className="ml-4">{payload.rating} stars</Text>
      </View>
    );
  }

  return <View />;
}
