import { api } from "@/api/api";
import { Link, useLocalSearchParams } from "expo-router";
import { Suspense } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Page() {
  return (
    <Suspense fallback={<ActivityIndicator />}>
      <Content />
    </Suspense>
  );
}

function Content() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const query = api.useSuspenseQuery("get", "/api/v2/reviews/user/{username}", {
    params: {
      path: {
        username,
      },
      query: {
        pageSize: 20,
      },
    },
  });

  const reviews = query.data.reviews;

  return (
    <View>
      {reviews.map((review) => (
        <Link
          key={review.id}
          href={{
            pathname: "/(app)/p/[id]",
            params: {
              id: review.poiId,
            },
          }}
          className="mt-4"
        >
          <View>
            <View className="flex flex-row items-center gap-2">
              <Text>Reviewed</Text>
              <Text className="text-primary">{review.poi.name}</Text>
              <Text>{review.rating} stars</Text>
            </View>
            <Text className="mt-1 text-sm text-zinc-500">
              {review.content.slice(0, 50) + "..."}
            </Text>
            <Text className="text-xs text-zinc-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </Link>
      ))}
    </View>
  );
}
