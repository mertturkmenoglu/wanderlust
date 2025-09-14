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
  const query = api.useSuspenseQuery("get", "/api/v2/lists/user/{username}", {
    params: {
      path: {
        username,
      },
      query: {
        pageSize: 20,
      },
    },
  });

  const lists = query.data.lists;

  return (
    <View>
      {lists.map((list) => (
        <Link
          key={list.id}
          href={{
            // TODO: Change later
            pathname: "/(app)/p/[id]",
            params: {
              id: list.id,
            },
          }}
          className="mt-4"
        >
          <View>
            <View className="flex flex-row items-center gap-2">
              <Text className="text-primary">{list.name}</Text>
            </View>
            <Text className="text-xs text-zinc-500">
              {new Date(list.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </Link>
      ))}
    </View>
  );
}
